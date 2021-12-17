import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const commentsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const commentsSlice = createSlice({
	name: 'comments',
	initialState: commentsAdapter.getInitialState({op: DEFAULT_OP.loading, pages: null, total: 0}),
	reducers: {
		commentsReceieved: (state, action) => {
			commentsAdapter.setAll(state, action.payload);
			state.op = null;
		},
		commentsUpsertMany: (state, action) => {
			commentsAdapter.upsertMany(state, action.payload);
			state.op = null;
		},
		commentsUpsertOne: (state, {payload}) => {
			commentsAdapter.upsertOne(state, payload);
			state.op = null;
		},
		commentsRemoveOne: (state, {payload}) => {
			commentsAdapter.removeOne(state, payload.id);
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
	commentsReceieved,
	commentsUpsertMany,
	commentsUpsertOne,
	commentsRemoveOne,
	gotPages,
	opStart,
	opEnd,
} = commentsSlice.actions;

export const loadComments = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getComments(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countComments(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));
		return dispatch(commentsReceieved(res));
	}

	return dispatch(commentsUpsertMany(res));
};

export const createOrDeleteComment = payload => async (dispatch, getState) => {
	dispatch(opStart());

	const res = payload.id ? await api.deleteComment(payload.id) : await api.createComment(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (res.id) {
		dispatch(commentsUpsertOne({storyId: payload.story, ...res}));
	}

	dispatch(commentsRemoveOne({storyId: payload.story, id: payload.id}));
};

//SELECTORS

const commentsSelector = commentsAdapter.getSelectors(state => state.comments);

export const selectComments = state => commentsSelector.selectAll(state);

export default commentsSlice.reducer;
