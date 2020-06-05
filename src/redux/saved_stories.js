import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {newToast} from './toast';
import {gotSaved, removeSaved} from './story';
import {Toast} from 'types/toast';
import {gotDataHelper} from './hepler';

export const savedStorySlice = createSlice({
	name: 'saved_stories',
	initialState: {
		data: null,
		error: null,
		pages: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = gotDataHelper(state.data, action.payload);
			state.loading = false;
		},
		gotSavedStory: (state, action) => {
			state.data = gotDataHelper(state.data, action.payload);
			state.loading = false;
		},
		removeSavedStory: (state, action) => {
			delete state.data[action.payload];
			state.loading = false;
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

export const {
	logOut,
	hasError,
	gotPages,
	gotData,
	gotSavedStory,
	removeSavedStory,
	loadingStart,
	loadingEnd,
} = savedStorySlice.actions;

export const loadSavedStories = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getSavedStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
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

export const createOrDeleteSavedStory = (favourite, userId, storyId) => async (
	dispatch,
	getState
) => {
	dispatch(loadingStart());

	const res = favourite
		? await api.deleteSavedStory(favourite.id)
		: await api.createSavedStory({user: userId, story: storyId});

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}

	if (res.id) {
		dispatch(gotSavedStory(res));
		return dispatch(gotSaved({...res, storyId}));
	}
	dispatch(removeSaved({storyId, savedId: favourite.id}));
	return dispatch(removeSavedStory(favourite.id));
};

const savedStories = state => state.saved_stories.data;

export const selectUserSavedStories = createSelector([savedStories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export default savedStorySlice.reducer;
