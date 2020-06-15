import {createSlice, createSelector} from '@reduxjs/toolkit';
import filter from 'lodash/filter';

import * as api from '../lib/api';
import {goToStory, editStory, DELETED_STORY} from '../lib/routes';

import {Toast} from 'types/toast';
import {DEFAULT_STORYPAGE_DATA, STORY_OP} from 'types/story';
import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const storySlice = createSlice({
	name: 'stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
		filter: null,
		op: null,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			const {data, invalidate, filter} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate);
			state.loading = false;
			state.op = null;
			state.filter = filter;
		},
		removeStory: (state, action) => {
			delete state.data[action.payload];
			state.loading = null;
		},
		gotComment: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId].comments.push({...rest});
			state.op = null;
		},
		removeComment: (state, action) => {
			const {storyId, commentId} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				comments: state.data[storyId].comments.filter(c => c.id !== commentId),
			};
			state.op = null;
		},
		gotLike: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId].likes.push({...rest});
			state.op = null;
		},
		removeLike: (state, action) => {
			const {storyId, likeId} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				likes: state.data[storyId].likes.filter(l => l.id !== likeId),
			};
			state.op = null;
		},
		gotSaved: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId].saved_by.push({...rest});
			state.op = null;
		},
		removeSaved: (state, action) => {
			const {storyId, savedId} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				saved_by: state.data[storyId].saved_by.filter(l => l.id !== savedId),
			};
			state.op = null;
		},
		setFilter: (state, action) => {
			state.filter = action.payload;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
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
	setFilter,
	gotData,
	gotSaved,
	gotPages,
	gotComment,
	gotLike,
	gotFilter,
	removeStory,
	removeSaved,
	removeComment,
	removeLike,
} = storySlice.actions;

export const newStory = (payload, history) => async (dispatch, getState) => {
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
	dispatch(gotData({data: res}));
	// const message = payload.id ? 'Successfully updated story.' : 'Successfully created story.';
	history.push(editStory(res.id, page.id));
	// dispatch(newToast({...Toast.success(message)}));
};

export const createOrUpdateStory = (payload, history) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const res = payload.id ? await api.updateStory(payload) : await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(gotData({data: res}));
	const message = payload.id ? 'Successfully updated story.' : 'Successfully created story.';
	history.push(goToStory(res.id));
	dispatch(newToast({...Toast.success(message)}));
};

export const deleteStory = (storyId, history) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(removeStory(storyId));
	dispatch(newToast({...Toast.success('Successfully deleted story.')}));
	history.push(DELETED_STORY);
};

export const loadStories = (
	params,
	count,
	filter,
	op = STORY_OP.loading,
	invalidate
) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const res = await api.countStories(countParams);
		if (res.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(Math.ceil(res / 10)));
	}

	return dispatch(gotData({data: res, invalidate, filter}));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStory(id);

	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(gotData({data: res}));
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
		? await api.deleteLike(like.id, storyId)
		: await api.createLike({user: userId, story: storyId});

	if (res.error) {
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id) {
		return dispatch(gotLike({storyId, ...res}));
	}

	return dispatch(removeLike({storyId, likeId: like.id}));
};

//SELECTORS

const stories = state => state.stories.data;

const filterBy = state => state.stories.filter;

const storySelector = createSelector([stories], res =>
	res ? Object.values(res).map(item => item) : null
);

export const selectStories = createSelector(storySelector, filterBy, (stories, filterBy) =>
	!stories ? null : filterBy ? filter(stories, filterBy) : stories
);

export const selectStory = (state, id) => state.stories.data && state.stories.data[id];

export default storySlice.reducer;
