import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {createUserItem, getUserItems} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

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
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([
		userItemsUpsert(res),
		opEnd({op}),
		newToast({
			...Toast.success(`- ${res?.item?.price} coins`, `${res?.item?.name} bought`),
		}),
	]);
};

export const loadUserItems = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getUserItems(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? userItemsReceieved : userItemsUpsertMany;

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

const userItemsSelector = userItemsAdapter.getSelectors(state => state.userItems);

export const selectUserItems = state => userItemsSelector.selectAll(state);
export const selectUserItemsIds = state => userItemsSelector.selectIds(state);
export const selectUserItemsById = (state, id) => userItemsSelector.selectById(state, id);
export const selectItemFromUserItemById = (state, id) =>
	userItemsSelector.selectById(state, id)?.item;

export default userItemsSlice.reducer;
