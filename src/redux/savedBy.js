import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
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
		},
		savedByUpsertMany: (state, action) => {
			savedByAdapter.upsertMany(state, action.payload);
			state.loading = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		gotPages: (state, action) => {
			state.pages = Math.ceil(action.payload / 10);
			state.total = action.payload;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	savedByReceieved,
	savedByUpsertMany,
	gotPages,
} = savedBySlice.actions;

export const loadSavedBy = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getSavedStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countSavedStories(countParams);
		if (countRes.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(countRes));

		return dispatch(savedByReceieved(res));
	}

	return dispatch(savedByUpsertMany(res));
};

//SELECTORS

const savedBySelector = savedByAdapter.getSelectors(state => state.savedBy);

export const selectSavedBy = state => savedBySelector.selectAll(state);

export default savedBySlice.reducer;
