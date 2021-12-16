import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {getMarketplace, countMarketplace} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';

const marketplaceAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const marketplaceSlice = createSlice({
	name: 'marketplace',
	initialState: marketplaceAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		currentPage: 1,
	}),
	reducers: {
		marketplaceReceieved: (state, action) => {
			marketplaceAdapter.setAll(state, action.payload);
			state.op = null;
		},
		marketplaceUpsertMany: (state, action) => {
			marketplaceAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
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
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countMarketplace(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

		return dispatch(marketplaceReceieved(res));
	}

	return dispatch(marketplaceUpsertMany(res));
};

//SELECTORS

const marketplaceSelector = marketplaceAdapter.getSelectors(state => state.marketplace);

export const selectMarketplace = state => marketplaceSelector.selectAll(state);
export const selectMarketplaceIds = state => marketplaceSelector.selectIds(state);
export const selectMarketplaceById = (state, id) => marketplaceSelector.selectById(state, id);

export default marketplaceSlice.reducer;
