import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {goToStory, editStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {DEFAULT_STORYPAGE_DATA} from 'types/story';
import {newToast} from './toast';
import {hepler} from './hepler';

export const STORY_OP = {
	saving_comment: 'saving_comment',
	saving_like: 'saving_like',
	saving_saved: 'saving_saved',
	saving_storypage: 'saving_storypage',
	deleting_comment: 'deleting_comment',
	deleting_like: 'deleting_like',
	deleting_saved: 'deleting_saved',
	deleting_storypage: 'deleting_storypage',
};

export const storySlice = createSlice({
	name: 'stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
		op: null,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = hepler(action.payload);
			state.loading = false;
			state.op = null;
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
		gotStoryPage: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				storypages: state.data[storyId].storypages.filter(
					item => item.id !== action.payload.id
				),
			};
			state.data[storyId].storypages.push({...rest});
		},
		removeStoryPage: (state, action) => {
			const {storyId, pageId} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				storypages: state.data[storyId].storypages.filter(p => p.id !== pageId),
			};
			state.op = null;
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
	gotData,
	gotStoryPage,
	gotComment,
	gotPages,
	gotLike,
	gotSaved,
	removeStoryPage,
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
	dispatch(gotData([res]));
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
	dispatch(gotData([res]));
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
};

export const loadStories = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const res = await api.countStories(
			params && {user: params.user, published: params.published}
		);
		if (res.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(Math.ceil(res / 12)));
	}
	return dispatch(gotData(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStory(id);

	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(gotData([res]));
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

export const createOrUpdateStoryPage = (payload, history) => async (dispatch, getState) => {
	dispatch(opStart(STORY_OP.saving_storypage));

	const res = payload.id
		? await api.updateStoryPage(payload)
		: await api.createStoryPage(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (!payload.id) {
		history.push(editStory(payload.story, res.id));

		dispatch(newToast({...Toast.success('Successfully created story page.')}));
	}

	dispatch(gotStoryPage({storyId: payload.story, ...res}));

	dispatch(opEnd());
};

export const deleteStoryPage = (storyId, pageId) => async (dispatch, getState) => {
	dispatch(opStart(STORY_OP.deleting_storypage));

	const res = await api.deleteStoryPage(pageId);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(removeStoryPage({storyId, pageId}));
	return dispatch(newToast({...Toast.success('Successfully removed page!')}));
};

//SELECTORS

const stories = state => state.stories.data;

export const selectStories = createSelector([stories], res =>
	res ? Object.values(res).map(item => item) : null
);

export const selectStory = (state, id) => state.stories.data && state.stories.data[id];

export default storySlice.reducer;
