import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {createUserItem, getUserItems, countUserItems} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const userItemsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const userItemsSlice = createSlice({
	name: 'userItems',
	initialState: userItemsAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		userItemsReceieved: (state, action) => {
			userItemsAdapter.setAll(state, action.payload);
		},
		userItemsUpsertMany: (state, action) => {
			userItemsAdapter.upsertMany(state, action.payload);
		},
		userItemsUpsert: (state, {payload}) => {
			userItemsAdapter.upsertOne(state, payload);
			state.total += 1;
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
	userItemsUpsert,
	userItemsUpsertMany,
	userItemsReceieved,
} = userItemsSlice.actions;

export const purchaseUserItem = payload => async (dispatch, getState) => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));
	const res = await createUserItem(payload);

	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	return dispatch([
		userItemsUpsert(res),
		opEnd({op}),
		newToast({
			...Toast.success(`- ${res?.item?.price} coins`, `${res?.item?.name} bought`),
		}),
	]);
};

export const loadUserItems = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getUserItems(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countUserItems(countParams);
		if (countRes.error) {
			return dispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}

		return dispatch([
			userItemsReceieved(res),
			gotPages({total: countRes, limit: params._limit}),
			opEnd({op}),
		]);
	}

	return dispatch([userItemsUpsertMany(res), opEnd({op})]);
};

//SELECTORS

const userItemsSelector = userItemsAdapter.getSelectors(state => state.userItems);

export const selectUserItems = state => userItemsSelector.selectAll(state);
export const selectUserItemsIds = state => userItemsSelector.selectIds(state);
export const selectUserItemsById = (state, id) => userItemsSelector.selectById(state, id);
export const selectItemFromUserItemById = (state, id) =>
	userItemsSelector.selectById(state, id)?.item;

export default userItemsSlice.reducer;
