import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';

import {newToast} from './toast';

const savedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const savedStorySlice = createSlice({
	name: 'saved_stories',
	initialState: savedStoriesAdapter.getInitialState({op: null, pages: null, loading: null}),
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
			state.op = null;
		},
		savedStoryRemoved: (state, action) => {
			savedStoriesAdapter.removeOne(state, action.payload.savedId);
			state.loading = null;
			state.op = null;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
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
		dispatch(gotPages(Math.ceil(countRes / 10)));

		return dispatch(savedStoriesReceieved(res));
	}

	return dispatch(savedStoryUpsertMany(res));
};

export const createOrDeleteSavedStory = (favourite, userId, storyId) => async (
	dispatch,
	getState
) => {
	dispatch(opStart(STORY_OP.loading));

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

const savedStoriesSelector = savedStoriesAdapter.getSelectors(state => state.saved_stories);

export const selectUserSavedStories = state => savedStoriesSelector.selectAll(state);

export default savedStorySlice.reducer;
