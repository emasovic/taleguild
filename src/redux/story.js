import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import {push} from 'connected-react-router';

import * as api from '../lib/api';
import {goToStory, editStory, DELETED_STORY} from '../lib/routes';

import {Toast} from 'types/toast';
import {STORY_OP} from 'types/story';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {savedStoryRemoved, savedStoryUpsert} from './savedStories';
import {storyPagesReceieved} from './storyPages';
import {archivedStoryRemoved, archivedStoryUpsert} from './archivedStories';
import {likesRemoveOne, likesUpsertOne} from './likes';
import {commentsRemoveOne, commentsUpsertOne} from './comments';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const storyAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const storySlice = createSlice({
	name: 'stories',
	initialState: storyAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		storiesReceieved: (state, {payload}) => {
			storyAdapter.setAll(state, payload);
		},
		storiesUpsertMany: (state, {payload}) => {
			storyAdapter.upsertMany(state, payload);
		},
		storyRemoved: (state, {payload}) => {
			storyAdapter.removeOne(state, payload);
			state.total -= 1;
		},
		storyUpsert: (state, action) => {
			storyAdapter.upsertOne(state, action.payload);
			state.total += 1;
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
	extraReducers: {
		[savedStoryUpsert]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].saved_by.push({...rest});
			state.entities[storyId].savedstories_count += 1;
		},
		[savedStoryRemoved]: (state, {payload}) => {
			const {storyId, savedId} = payload;
			if (state.entities[storyId]) {
				state.entities[storyId] = {
					...state.entities[storyId],
					saved_by: state.entities[storyId].saved_by.filter(s => s.id !== savedId),
				};
				state.entities[storyId].savedstories_count -= 1;
			}
		},
		[storyPagesReceieved]: (state, {payload}) => {
			storyAdapter.upsertOne(state, payload?.[0]?.story);
		},
		[archivedStoryUpsert]: (state, {payload}) => {
			const {keepArchived} = payload;

			keepArchived
				? storyAdapter.upsertOne(state, payload)
				: storyAdapter.removeOne(state, payload.id);
		},
		[archivedStoryRemoved]: (state, {payload}) => {
			payload.hasOwnProperty('user') && storyAdapter.upsertOne(state, payload);
		},
		[likesUpsertOne]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].likes.push({...rest});
			state.entities[storyId].likes_count += 1;
		},
		[likesRemoveOne]: (state, {payload}) => {
			const {storyId, id: likeId} = payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				likes: state.entities[storyId].likes.filter(l => l.id !== likeId),
			};
			state.entities[storyId].likes_count -= 1;
		},
		[commentsUpsertOne]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].comments.push({...rest});
			state.entities[storyId].comments_count += 1;
		},
		[commentsRemoveOne]: (state, {payload}) => {
			const {storyId, id: commentId} = payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				comments: state.entities[storyId].comments.filter(c => c.id !== commentId),
			};
			state.entities[storyId].comments_count -= 1;
		},
	},
});

export const {
	loadingStart,
	opStart,
	opEnd,
	loadingEnd,
	storiesReceieved,
	storiesUpsertMany,
	storyUpsert,
	storyRemoved,
	gotPages,
} = storySlice.actions;

export const newStory = payload => async (dispatch, getState) => {
	const op = DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = await api.createStory(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const page = res?.storypages?.[0];

	batchDispatch([storyUpsert(res), opEnd({op}), push(editStory(res.id, page?.id))], dispatch);
};

export const createOrUpdateStory = (payload, shouldChange = true) => async (dispatch, getState) => {
	const op = payload.id ? DEFAULT_OP.update : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = payload.id ? await api.updateStory(payload) : await api.createStory(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [storyUpsert(res), opEnd({op})];

	shouldChange &&
		actions.push(
			push(goToStory(res.id)),
			newToast({
				...Toast.success(
					'Your story has been successfully published in the Community and is now public.'
				),
			})
		);

	batchDispatch(actions, dispatch);
};

export const deleteStory = storyId => async (dispatch, getState) => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteStory(storyId);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	batchDispatch([storyRemoved(storyId), opEnd({op}), push(DELETED_STORY)]);
};

export const loadStories = (params, op = STORY_OP.loading) => async (dispatch, getState) => {
	dispatch(opStart(op));
	const res = await api.getStories(params);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const action = !params._start ? storiesReceieved : storiesUpsertMany;

	return batchDispatch([
		action(res.data),
		gotPages({total: res.total, limit: params._limit}),
		opEnd({op}),
	]);
};

export const loadStory = id => async dispatch => {
	const op = STORY_OP.loading;
	dispatch(opStart(op));

	const res = await api.getStory(id);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	return batchDispatch([storyUpsert(res), opEnd({op})]);
};

//SELECTORS

const storySelector = storyAdapter.getSelectors(state => state.stories);

export const selectStories = state => storySelector.selectAll(state);

export const selectStoryIds = state => storySelector.selectIds(state);

export const selectStory = (state, id) => storySelector.selectById(state, id);

export default storySlice.reducer;
