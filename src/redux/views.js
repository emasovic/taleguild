import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {getViews, countViews} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';

const viewsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const viewsSlice = createSlice({
	name: 'views',
	initialState: viewsAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		total: 0,
		currentPage: 1,
	}),
	reducers: {
		viewsReceieved: (state, action) => {
			viewsAdapter.setAll(state, action.payload);
			state.op = null;
		},
		viewsUpsertMany: (state, action) => {
			viewsAdapter.upsertMany(state, action.payload);
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

export const {opStart, opEnd, gotPages, viewsUpsertMany, viewsReceieved} = viewsSlice.actions;

export const loadViews = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getViews(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countViews(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

		return dispatch(viewsReceieved(res));
	}

	return dispatch(viewsUpsertMany(res));
};

//SELECTORS

const viewsSelector = viewsAdapter.getSelectors(state => state.views);

export const selectViews = state => viewsSelector.selectAll(state);
export const selectViewsIds = state => viewsSelector.selectIds(state);
export const selectViewsById = (state, id) => viewsSelector.selectById(state, id);

export default viewsSlice.reducer;
