import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const draftStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const draftSlice = createSlice({
	name: 'draftStories',
	initialState: draftStoriesAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,

		total: 0,
	}),
	reducers: {
		draftStoriesReceieved: (state, action) => {
			draftStoriesAdapter.setAll(state, action.payload);
		},
		draftStoryUpsertMany: (state, action) => {
			draftStoriesAdapter.upsertMany(state, action.payload);
		},
		draftStoryUpsert: (state, action) => {
			draftStoriesAdapter.upsertOne(state, action.payload);
			state.total += 1;
		},
		draftStoryRemoved: (state, action) => {
			draftStoriesAdapter.removeOne(state, action.payload);
			state.total -= 1;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
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

export const loadStories = (params, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	const action = !params._start ? draftStoriesReceieved : draftStoryUpsertMany;

	return dispatch([
		action(res.data),
		gotPages({total: res.total, limit: params._limit}),
		opEnd({op}),
	]);
};

export const deleteStory = storyId => async dispatch => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteStory(storyId);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	return dispatch([draftStoryRemoved(storyId), opEnd({op})]);
};

//SELECTORS

const draftStoriesSelector = draftStoriesAdapter.getSelectors(state => state.draftStories);

export const selectStories = state => draftStoriesSelector.selectAll(state);
export const selectStoryIds = state => draftStoriesSelector.selectIds(state);

export const selectDraftStory = (state, id) => draftStoriesSelector.selectById(state, id);

export default draftSlice.reducer;
