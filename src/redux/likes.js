import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {newToast} from './toast';

const likesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const likesSlice = createSlice({
	name: 'likes',
	initialState: likesAdapter.getInitialState({op: null, pages: null, loading: null}),
	reducers: {
		likesReceieved: (state, action) => {
			likesAdapter.setAll(state, action.payload);
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

export const {loadingStart, loadingEnd, likesReceieved, gotPages} = likesSlice.actions;

export const loadLikes = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getLikes(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const res = await api.countLikes(countParams);
		if (res.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(res));
	}

	return dispatch(likesReceieved(res));
};

//SELECTORS

const likesSelector = likesAdapter.getSelectors(state => state.likes);

export const selectLikes = state => likesSelector.selectAll(state);

export default likesSlice.reducer;
