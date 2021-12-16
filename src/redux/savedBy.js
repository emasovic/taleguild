import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const savedByAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const savedBySlice = createSlice({
	name: 'savedBy',
	initialState: savedByAdapter.getInitialState({op: null, pages: null, loading: null}),
	reducers: {
		savedByReceieved: (state, action) => {
			savedByAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		savedByUpsertMany: (state, action) => {
			savedByAdapter.upsertMany(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	savedByReceieved,
	savedByUpsertMany,
	gotPages,
	opStart,
	opEnd,
} = savedBySlice.actions;

export const loadSavedBy = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getSavedStories(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countSavedStories(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

		return dispatch(savedByReceieved(res));
	}

	return dispatch(savedByUpsertMany(res));
};

//SELECTORS

const savedBySelector = savedByAdapter.getSelectors(state => state.savedBy);

export const selectSavedBy = state => savedBySelector.selectAll(state);

export default savedBySlice.reducer;
