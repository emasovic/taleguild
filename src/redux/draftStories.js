import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const draftStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
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
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? draftStoriesReceieved : draftStoryUpsertMany;

	return batchDispatch([
		action(data),
		gotPages({
			total: meta.pagination.total,
			limit: meta.pagination.limit,
		}),
		opEnd({op}),
	]);
};

export const deleteStory = storyId => async dispatch => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteStory(storyId);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([draftStoryRemoved(storyId), opEnd({op})]);
};

//SELECTORS

const draftStoriesSelector = draftStoriesAdapter.getSelectors(state => state.draftStories);

export const selectStories = state => draftStoriesSelector.selectAll(state);
export const selectStoryIds = state => draftStoriesSelector.selectIds(state);

export const selectDraftStory = (state, id) => draftStoriesSelector.selectById(state, id);

export default draftSlice.reducer;
