import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';

import {newToast} from './toast';

const archivedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	// sortComparer: (a, b) => b.published_at.localeCompare(a.published_at),
});

export const archivedStorySlice = createSlice({
	name: 'archivedStories',
	initialState: archivedStoriesAdapter.getInitialState({op: null, pages: null, loading: null}),
	reducers: {
		archivedStoriesReceieved: (state, action) => {
			archivedStoriesAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		archivedStoryUpsertMany: (state, action) => {
			archivedStoriesAdapter.upsertMany(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		archivedStoryUpsert: (state, {payload}) => {
			archivedStoriesAdapter.upsertOne(state, payload);
			state.loading = null;
			state.op = null;
		},
		archivedStoryRemoved: (state, {payload}) => {
			archivedStoriesAdapter.removeOne(state, payload.id);
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
	archivedStoriesReceieved,
	archivedStoryUpsertMany,
	archivedStoryUpsert,
	archivedStoryRemoved,
} = archivedStorySlice.actions;

export const loadArchivedStories = (params, count, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.getStories(countParams);

		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(Math.ceil(countRes / 10)));

		return dispatch(archivedStoriesReceieved(res));
	}

	return dispatch(archivedStoryUpsertMany(res));
};

export const updateArchivedStory = (payload, keepArchived) => async (dispatch, getState) => {
	dispatch(opStart(STORY_OP.loading));

	const res = await api.updateStory(payload);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	res.archived_at
		? dispatch(archivedStoryUpsert({...res, keepArchived}))
		: dispatch(archivedStoryRemoved(res));
};

export const removeArchivedStory = storyId => async (dispatch, getState, history) => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(archivedStoryRemoved(storyId));
	dispatch(newToast({...Toast.success('Successfully deleted story.')}));
};

//SELECTORS

const archivedStoriesSelector = archivedStoriesAdapter.getSelectors(state => state.archivedStories);

export const selectArchivedStories = state => archivedStoriesSelector.selectAll(state);

export default archivedStorySlice.reducer;
