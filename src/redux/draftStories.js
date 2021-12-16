import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const draftStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const draftSlice = createSlice({
	name: 'draftStories',
	initialState: draftStoriesAdapter.getInitialState({
		op: null,
		pages: null,
		loading: null,
		currentPage: 1,
		total: 0,
	}),
	reducers: {
		draftStoriesReceieved: (state, action) => {
			draftStoriesAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		draftStoryUpsertMany: (state, action) => {
			draftStoriesAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.loading = null;
			state.op = null;
		},
		draftStoryUpsert: (state, action) => {
			draftStoriesAdapter.upsertOne(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		draftStoryRemoved: (state, action) => {
			draftStoriesAdapter.removeOne(state, action.payload);
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
			state.loading = false;
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
	loadingStart,
	loadingEnd,
	opStart,
	opEnd,
	gotPages,
	draftStoriesReceieved,
	draftStoryUpsertMany,
	draftStoryUpsert,
	draftStoryRemoved,
} = draftSlice.actions;

export const loadStories = (params, count, op = STORY_OP.loading) => async dispatch => {
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

		return dispatch(draftStoriesReceieved(res));
	}

	return dispatch(draftStoryUpsertMany(res));
};

export const deleteStory = storyId => async dispatch => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(draftStoryRemoved(storyId));
};

//SELECTORS

const draftStoriesSelector = draftStoriesAdapter.getSelectors(state => state.draftStories);

export const selectStories = state => draftStoriesSelector.selectAll(state);
export const selectStoryIds = state => draftStoriesSelector.selectIds(state);

export const selectDraftStory = (state, id) => draftStoriesSelector.selectById(state, id);

export default draftSlice.reducer;
