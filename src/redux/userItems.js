import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {createUserItem, getUserItems, countUserItems} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';

const userItemsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const userItemsSlice = createSlice({
	name: 'userItems',
	initialState: userItemsAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		currentPage: 1,
	}),
	reducers: {
		userItemsReceieved: (state, action) => {
			userItemsAdapter.setAll(state, action.payload);
			state.op = null;
		},
		userItemsUpsertMany: (state, action) => {
			userItemsAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.op = null;
		},
		gotPages: (state, action) => {
			state.pages = Math.ceil(action.payload / 10);
			state.total = action.payload;
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
	userItemsUpsertMany,
	userItemsReceieved,
} = userItemsSlice.actions;

export const purchaseUserItem = payload => async (dispatch, getState) => {
	dispatch(opStart(DEFAULT_OP.loading));
	const res = await createUserItem(payload);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(newToast({...Toast.success('Successfully bought item!')}));
	dispatch(userItemsUpsertMany(res));
};

export const loadMarketplace = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getUserItems(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countUserItems(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(countRes));

		return dispatch(userItemsReceieved(res));
	}

	return dispatch(userItemsUpsertMany(res));
};

//SELECTORS

const userItemsSelector = userItemsAdapter.getSelectors(state => state.userItems);

export const selectMarketplace = state => userItemsSelector.selectAll(state);
export const selectMarketplaceIds = state => userItemsSelector.selectIds(state);
export const selectMarketplaceById = (state, id) => userItemsSelector.selectById(state, id);

export default userItemsSlice.reducer;
