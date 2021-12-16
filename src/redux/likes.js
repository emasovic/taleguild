import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const likesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const likesSlice = createSlice({
	name: 'likes',
	initialState: likesAdapter.getInitialState({op: null, pages: null}),
	reducers: {
		likesReceieved: (state, action) => {
			likesAdapter.setAll(state, action.payload);
			state.op = null;
		},
		likesUpsertMany: (state, action) => {
			likesAdapter.upsertMany(state, action.payload);
			state.op = null;
		},
		likesUpsertOne: (state, {payload}) => {
			likesAdapter.upsertOne(state, payload);
			state.op = null;
		},
		likesRemoveOne: (state, {payload}) => {
			likesAdapter.removeOne(state, payload.id);
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
	likesReceieved,
	likesUpsertMany,
	likesUpsertOne,
	likesRemoveOne,
	gotPages,
	opStart,
	opEnd,
} = likesSlice.actions;

export const loadLikes = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getLikes(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countLikes(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));
		return dispatch(likesReceieved(res));
	}

	return dispatch(likesUpsertMany(res));
};

export const createOrDeleteLike = (like, userId, storyId) => async dispatch => {
	const res = like
		? await api.deleteLike(like.id)
		: await api.createLike({user: userId, story: storyId});

	if (res.error) {
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id && !like) {
		return dispatch(likesUpsertOne({storyId, ...res}));
	}

	return dispatch(likesRemoveOne({storyId, id: like.id}));
};

//SELECTORS

const likesSelector = likesAdapter.getSelectors(state => state.likes);

export const selectLikes = state => likesSelector.selectAll(state);

export default likesSlice.reducer;
