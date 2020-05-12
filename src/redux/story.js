import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {goToStory, goToUserStories} from '../lib/routes';

import {Toast} from 'types/toast';
import {newToast} from './toast';

export const storySlice = createSlice({
	name: 'stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = helper(action.payload);
			state.error = action.payload.error;
			state.loading = false;
		},
		removeStory: (state, action) => {
			delete state.data[action.payload];
			state.loading = false;
		},
		gotComment: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId].comments.push({...rest});
			state.loading = false;
			state.error = action.payload.error;
		},
		gotLike: (state, action) => {
			const {storyId, ...rest} = action.payload;
			state.data[storyId].likes.push({...rest});
			state.loading = false;
			state.error = action.payload.error;
		},
		removeLike: (state, action) => {
			const {storyId, likeId} = action.payload;
			state.data[storyId] = {
				...state.data[storyId],
				likes: state.data[storyId].likes.filter(l => l.id !== likeId),
			};
			state.loading = false;
			state.error = action.payload.error;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

const helper = arr =>
	arr.reduce((map, obj) => {
		map[obj.id] = obj;
		return map;
	}, {});

export const {
	logOut,
	hasError,
	gotData,
	loadingStart,
	loadingEnd,
	removeStory,
	gotComment,
	gotPages,
	gotLike,
	removeLike,
} = storySlice.actions;

export const createOrUpdateStory = (payload, history) => async (dispatch, getState) => {
	dispatch(loadingStart());
	const state = getState();
	const {user} = state;

	const res = payload.id
		? await api.updateStory(user.data.token, payload)
		: await api.createStory(user.data.token, payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotData([res]));
	const message = payload.id ? 'Uspešno ste izmenili priču.' : 'Uspešno ste kreirali priču.';
	history.push(goToStory(res.id));
	dispatch(newToast({...Toast.success(message)}));
};

export const deleteStory = (storyId, history) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const state = getState();
	const {user} = state;

	const res = await api.deleteStory(user.data.token, storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(removeStory(storyId));
	history.push(goToUserStories(user.data.id));
	dispatch(newToast({...Toast.success('Uspešno ste obrisali priču.')}));
};

export const loadStories = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStories(params);
	if (count) {
		const res = await api.countStories(params && {user: params.user});
		dispatch(gotPages(Math.ceil(res / 12)));
	}
	return dispatch(gotData(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStory(id);
	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotData([res]));
};

export const createComment = payload => async (dispatch, getState) => {
	dispatch(loadingStart());
	const state = getState();
	const {user} = state;

	const res = await api.createComment(user.data.token, payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotComment({storyId: payload.story, ...res}));
	dispatch(newToast({...Toast.success('Uspešno ste postavili komentar.')}));
};

export const createOrDeleteLike = (like, userId, storyId) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const state = getState();
	const {user} = state;

	const res = like
		? await api.deleteLike(user.data.token, like.id)
		: await api.createLike(user.data.token, {user: userId, story: storyId});

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}

	if (res.id) {
		return dispatch(gotLike({storyId, ...res, story: storyId, user: userId}));
	}

	return dispatch(removeLike({storyId: storyId, likeId: like.id}));
};

//SELECTORS

const stories = state => state.stories.data;

export const selectStories = createSelector([stories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export const selectStory = (state, id) => state.stories.data && state.stories.data[id];

export default storySlice.reducer;
