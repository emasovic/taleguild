import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {getViews, countViews, createViews} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const viewsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const viewsSlice = createSlice({
	name: 'views',
	initialState: viewsAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		viewsReceieved: (state, action) => {
			viewsAdapter.setAll(state, action.payload);
		},
		viewsUpsertMany: (state, action) => {
			viewsAdapter.upsertMany(state, action.payload);
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

export const {opStart, opEnd, gotPages, viewsUpsertMany, viewsReceieved} = viewsSlice.actions;

export const loadViews = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getViews(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countViews(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}

		return batchDispatch([
			viewsReceieved(res),
			gotPages({total: countRes, limit: params._limit}),
			opEnd({op}),
		]);
	}

	return batchDispatch([viewsUpsertMany(res), opEnd({op})]);
};

export const createOrUpdateViews = (id, userId) => async dispatch => {
	const op = DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = await createViews({
		storyId: id,
		userAgent: navigator.userAgent,
		userId,
	});
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return dispatch(opEnd({op}));
};

//SELECTORS

const viewsSelector = viewsAdapter.getSelectors(state => state.views);

export const selectViews = state => viewsSelector.selectAll(state);
export const selectViewsIds = state => viewsSelector.selectIds(state);
export const selectViewsById = (state, id) => viewsSelector.selectById(state, id);

export default viewsSlice.reducer;
