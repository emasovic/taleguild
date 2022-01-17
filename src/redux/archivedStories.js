import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const archivedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const archivedStorySlice = createSlice({
	name: 'archivedStories',
	initialState: archivedStoriesAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		archivedStoriesReceieved: (state, {payload}) => {
			archivedStoriesAdapter.setAll(state, payload);
		},
		archivedStoryUpsertMany: (state, {payload}) => {
			archivedStoriesAdapter.upsertMany(state, payload);
		},
		archivedStoryUpsert: (state, {payload}) => {
			archivedStoriesAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		archivedStoryRemoved: (state, {payload}) => {
			archivedStoriesAdapter.removeOne(state, payload.id);
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

export const loadArchivedStories = (params, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	const action = !params._start ? archivedStoriesReceieved : archivedStoryUpsertMany;

	return dispatch([
		action(res.data),
		gotPages({total: res.total, limit: params._limit}),
		opEnd({op}),
	]);
};

export const updateArchivedStory = (payload, keepArchived) => async (dispatch, getState) => {
	const op = DEFAULT_OP.update;
	dispatch(opStart(op));

	const res = await api.updateStory(payload);

	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	res.archived_at
		? dispatch(archivedStoryUpsert({...res, keepArchived}))
		: dispatch(archivedStoryRemoved(res));
	dispatch(opEnd({op}));
};

export const removeArchivedStory = storyId => async (dispatch, getState, history) => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteStory(storyId);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}
	return dispatch([archivedStoryRemoved({id: storyId}), opEnd({op})]);
};

//SELECTORS

const archivedStoriesSelector = archivedStoriesAdapter.getSelectors(state => state.archivedStories);

export const selectArchivedStories = state => archivedStoriesSelector.selectAll(state);
export const selectArchivedStory = (state, id) => archivedStoriesSelector.selectById(state, id);

export default archivedStorySlice.reducer;
