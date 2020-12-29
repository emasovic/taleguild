import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {goToStory, editStory, DELETED_STORY} from '../lib/routes';

import {Toast} from 'types/toast';
import {DEFAULT_STORYPAGE_DATA, STORY_OP} from 'types/story';
import {newToast} from './toast';

const storyAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const storySlice = createSlice({
	name: 'stories',
	initialState: storyAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		loading: null,
	}),
	reducers: {
		storiesReceieved: (state, action) => {
			storyAdapter.setAll(state, action.payload);
			state.loading = false;
			state.op = null;
		},
		storiesUpsertMany: (state, action) => {
			storyAdapter.upsertMany(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		storyRemoved: (state, action) => {
			storyAdapter.removeOne(state, action.payload);
			state.op = null;
			state.loading = null;
		},
		storyUpsert: (state, action) => {
			storyAdapter.upsertOne(state, action.payload);
			state.op = null;
			state.loading = null;
		},
		gotComment: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.entities[storyId].comments.push({...rest});
			state.op = null;
		},
		removeComment: (state, action) => {
			const {storyId, commentId} = action.payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				comments: state.entities[storyId].comments.filter(c => c.id !== commentId),
			};
			state.op = null;
		},
		gotLike: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.entities[storyId].likes.push({...rest});
			state.op = null;
		},
		removeLike: (state, action) => {
			const {storyId, likeId} = action.payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				likes: state.entities[storyId].likes.filter(l => l.id !== likeId),
			};
			state.op = null;
		},
		gotSaved: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.entities[storyId].saved_by.push({...rest});
			state.op = null;
		},
		removeSaved: (state, action) => {
			const {storyId, savedId} = action.payload;
			if (state.entities[storyId]) {
				state.entities[storyId] = {
					...state.entities[storyId],
					saved_by: state.entities[storyId].saved_by.filter(s => s.id !== savedId),
				};
			}
			state.op = null;
		},
		gotPages: (state, action) => {
			state.pages = Math.ceil(action.payload / 10);
			state.total = action.payload;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
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
	gotSaved,
	gotPages,
	gotComment,
	gotLike,
	removeSaved,
	removeComment,
	removeLike,
} = storySlice.actions;

export const newStory = payload => async (dispatch, getState, history) => {
	dispatch(loadingStart());

	const res = await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	const page = await api.createStoryPage({story: res.id, text: DEFAULT_STORYPAGE_DATA});

	if (page.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
	return history.push(editStory(res.id, page.id));
};

export const createOrUpdateStory = (payload, shouldChange = true) => async (
	dispatch,
	getState,
	history
) => {
	dispatch(loadingStart());

	const res = payload.id ? await api.updateStory(payload) : await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
	const message = payload.id ? 'Successfully updated story.' : 'Successfully created story.';
	if (shouldChange) {
		history.push(goToStory(res.id));
		dispatch(newToast({...Toast.success(message)}));
	}
};

export const deleteStory = storyId => async (dispatch, getState, history) => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyRemoved(storyId));
	dispatch(newToast({...Toast.success('Successfully deleted story.')}));
	return history.push(DELETED_STORY);
};

export const loadStories = (params, count, op = STORY_OP.loading) => async (dispatch, getState) => {
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
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(countRes));

		return dispatch(storiesReceieved(res));
	}

	return dispatch(storiesUpsertMany(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStory(id);

	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
};

export const createOrDeleteComment = payload => async (dispatch, getState) => {
	dispatch(opStart());

	const res = payload.id ? await api.deleteComment(payload.id) : await api.createComment(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (res.id) {
		dispatch(gotComment({storyId: payload.story, ...res}));
		return dispatch(newToast({...Toast.success('Successfully posted comment.')}));
	}

	dispatch(removeComment({storyId: payload.story, commentId: payload.id}));
	return dispatch(newToast({...Toast.success('Successfully deleted comment.')}));
};

export const createOrDeleteLike = (like, userId, storyId) => async (dispatch, getState) => {
	const res = like
		? await api.deleteLike(like.id)
		: await api.createLike({user: userId, story: storyId});

	if (res.error) {
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id && !like) {
		return dispatch(gotLike({storyId, ...res}));
	}

	return dispatch(removeLike({storyId, likeId: like.id}));
};

//SELECTORS

const storySelector = storyAdapter.getSelectors(state => state.stories);

export const selectStories = state => storySelector.selectAll(state);

export const selectStory = (state, id) => storySelector.selectById(state, id);

export default storySlice.reducer;
