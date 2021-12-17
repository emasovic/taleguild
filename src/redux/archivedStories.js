import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const archivedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const archivedStorySlice = createSlice({
	name: 'archivedStories',
	initialState: archivedStoriesAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		loading: null,
		currentPage: 1,
		total: 0,
	}),
	reducers: {
		archivedStoriesReceieved: (state, action) => {
			archivedStoriesAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		archivedStoryUpsertMany: (state, action) => {
			archivedStoriesAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
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
	archivedStoriesReceieved,
	archivedStoryUpsertMany,
	archivedStoryUpsert,
	archivedStoryRemoved,
} = archivedStorySlice.actions;

export const loadArchivedStories = (params, count, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countStories(countParams);
		if (countRes.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

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
	dispatch(archivedStoryRemoved({id: storyId}));
};

//SELECTORS

const archivedStoriesSelector = archivedStoriesAdapter.getSelectors(state => state.archivedStories);

export const selectArchivedStories = state => archivedStoriesSelector.selectAll(state);
export const selectArchivedStory = (state, id) => archivedStoriesSelector.selectById(state, id);

export default archivedStorySlice.reducer;
