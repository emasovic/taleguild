import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const savedStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const savedStorySlice = createSlice({
	name: 'savedStories',
	initialState: savedStoriesAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		savedStoriesReceieved: (state, action) => {
			savedStoriesAdapter.setAll(state, action.payload);
		},
		savedStoryUpsertMany: (state, action) => {
			savedStoriesAdapter.upsertMany(state, action.payload);
		},
		savedStoryUpsert: (state, action) => {
			savedStoriesAdapter.upsertOne(state, action.payload);
			state.total += 1;
		},
		savedStoryRemoved: (state, action) => {
			savedStoriesAdapter.removeOne(state, action.payload.savedId);
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
	savedStoriesReceieved,
	savedStoryUpsertMany,
	savedStoryUpsert,
	savedStoryRemoved,
} = savedStorySlice.actions;

export const loadSavedStories = (params, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getSavedStories(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}
	const action = !params._start ? savedStoriesReceieved : savedStoryUpsertMany;

	return batchDispatch([
		action(res.data),
		gotPages({total: res.total, limit: params._limit}),
		opEnd({op}),
	]);
};

export const createOrDeleteSavedStory = (favourite, userId, storyId) => async dispatch => {
	const op = favourite?.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = favourite
		? await api.deleteSavedStory(favourite.id)
		: await api.createSavedStory({user: userId, story: storyId});

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	const actions = [opEnd({op})];

	if (favourite?.id) {
		actions.unshift(savedStoryRemoved({storyId, savedId: favourite.id}));
	} else {
		actions.unshift(savedStoryUpsert({...res, storyId}));
	}

	return dispatch(actions);
};

//SELECTORS

const savedStoriesSelector = savedStoriesAdapter.getSelectors(state => state.savedStories);

export const selectUserSavedStories = state => savedStoriesSelector.selectAll(state);
export const selectUserSavedStory = (state, id) => savedStoriesSelector.selectById(state, id);

export default savedStorySlice.reducer;
