import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {getMarketplace} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const marketplaceAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

export const marketplaceSlice = createSlice({
	name: 'marketplace',
	initialState: marketplaceAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		marketplaceReceieved: (state, action) => {
			marketplaceAdapter.setAll(state, action.payload);
		},
		marketplaceUpsertMany: (state, action) => {
			marketplaceAdapter.upsertMany(state, action.payload);
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
	},
});

export const {
	opStart,
	opEnd,
	gotPages,
	marketplaceUpsertMany,
	marketplaceReceieved,
} = marketplaceSlice.actions;

export const loadMarketplace = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getMarketplace(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? marketplaceReceieved : marketplaceUpsertMany;

	return batchDispatch([
		action(data),
		gotPages({
			total: meta.pagination.total,
			totalNew: meta.pagination.totalNew,
			limit: meta.pagination.limit,
		}),
		opEnd({op}),
	]);
};

//SELECTORS

const marketplaceSelector = marketplaceAdapter.getSelectors(state => state.marketplace);

export const selectMarketplace = state => marketplaceSelector.selectAll(state);
export const selectMarketplaceIds = state => marketplaceSelector.selectIds(state);
export const selectMarketplaceById = (state, id) => marketplaceSelector.selectById(state, id);

export default marketplaceSlice.reducer;
