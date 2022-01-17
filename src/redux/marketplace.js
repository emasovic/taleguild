import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {getMarketplace, countMarketplace} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const marketplaceAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
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
			state.op[DEFAULT_OP.loading] = endOperation();
		},
		marketplaceUpsertMany: (state, action) => {
			marketplaceAdapter.upsertMany(state, action.payload);

			state.op[DEFAULT_OP.loading] = endOperation();
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

export const loadMarketplace = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getMarketplace(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}), newToast({...Toast.error(res.error)})]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countMarketplace(countParams);
		if (countRes.error) {
			return dispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}

		return dispatch([
			dispatch(gotPages({total: countRes, limit: params._limit})),
			dispatch(marketplaceReceieved(res)),
			opEnd({op}),
		]);
	}

	return dispatch([marketplaceUpsertMany(res), opEnd({op})]);
};

//SELECTORS

const marketplaceSelector = marketplaceAdapter.getSelectors(state => state.marketplace);

export const selectMarketplace = state => marketplaceSelector.selectAll(state);
export const selectMarketplaceIds = state => marketplaceSelector.selectIds(state);
export const selectMarketplaceById = (state, id) => marketplaceSelector.selectById(state, id);

export default marketplaceSlice.reducer;
