import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';

import {newToast} from './toast';
import {gotComment, removeComment} from './story';

const commentsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const commentsSlice = createSlice({
	name: 'comments',
	initialState: commentsAdapter.getInitialState({op: null, pages: null, loading: null}),
	reducers: {
		commentsReceieved: (state, action) => {
			commentsAdapter.setAll(state, action.payload);
			state.loading = null;
		},
		commentsUpsertMany: (state, action) => {
			commentsAdapter.upsertMany(state, action.payload);
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
	extraReducers: {
		[gotComment]: (state, {payload}) => {
			commentsAdapter.addOne(state, payload);
		},
		[removeComment]: (state, {payload}) => {
			commentsAdapter.removeOne(state, payload.commentId);
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	commentsReceieved,
	commentsUpsertMany,
	gotPages,
} = commentsSlice.actions;

export const loadComments = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getComments(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countComments(countParams);
		if (countRes.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(countRes));
		return dispatch(commentsReceieved(res));
	}

	return dispatch(commentsUpsertMany(res));
};

//SELECTORS

const commentsSelector = commentsAdapter.getSelectors(state => state.comments);

export const selectComments = state => commentsSelector.selectAll(state);

export default commentsSlice.reducer;
