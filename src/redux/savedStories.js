import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const savedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const savedStorySlice = createSlice({
	name: 'savedStories',
	initialState: savedStoriesAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		savedStoriesReceieved: (state, action) => {
			savedStoriesAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		savedStoryUpsertMany: (state, action) => {
			savedStoriesAdapter.upsertMany(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		savedStoryUpsert: (state, action) => {
			savedStoriesAdapter.upsertOne(state, action.payload);
			state.loading = null;
			state.total += 1;
			state.op = null;
		},
		savedStoryRemoved: (state, action) => {
			savedStoriesAdapter.removeOne(state, action.payload.savedId);
			state.loading = null;
			state.total -= 1;
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = null;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
	},
});

export const {
	opStart,
	opEnd,
	loadingStart,
	loadingEnd,
	gotPages,
	savedStoriesReceieved,
	savedStoryUpsertMany,
	savedStoryUpsert,
	savedStoryRemoved,
} = savedStorySlice.actions;

export const loadSavedStories = (params, count, op = STORY_OP.loading) => async dispatch => {
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

		return dispatch(savedStoriesReceieved(res));
	}

	return dispatch(savedStoryUpsertMany(res));
};

export const createOrDeleteSavedStory = (favourite, userId, storyId) => async dispatch => {
	const op = favourite.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = favourite
		? await api.deleteSavedStory(favourite.id)
		: await api.createSavedStory({user: userId, story: storyId});

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id) {
		return dispatch(savedStoryUpsert({...res, storyId}));
	}

	return dispatch(savedStoryRemoved({storyId, savedId: favourite.id}));
};

//SELECTORS

const savedStoriesSelector = savedStoriesAdapter.getSelectors(state => state.savedStories);

export const selectUserSavedStories = state => savedStoriesSelector.selectAll(state);
export const selectUserSavedStory = (state, id) => savedStoriesSelector.selectById(state, id);

export default savedStorySlice.reducer;
