import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {gotSaved, removeSaved} from './story';
import {gotDataHelper} from './hepler';

export const savedStorySlice = createSlice({
	name: 'saved_stories',
	initialState: {
		data: null,
		error: null,
		pages: null,
		op: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			const {data, invalidate} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate);
			state.op = null;
			state.loading = null;
		},
		removeSavedStory: (state, action) => {
			state.data && delete state.data[action.payload];
			state.op = null;
			state.loading = null;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = null;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
	},
});

export const {
	opStart,
	opEnd,
	hasError,
	gotPages,
	gotData,
	removeSavedStory,
	loadingStart,
	loadingEnd,
} = savedStorySlice.actions;

export const loadSavedStories = (params, count, op = STORY_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getSavedStories(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const res = await api.countSavedStories(countParams);

		if (res.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(Math.ceil(res / 10)));
	}

	return dispatch(gotData({data: res}));
};

export const createOrDeleteSavedStory = (favourite, userId, storyId) => async (
	dispatch,
	getState
) => {
	dispatch(opStart(STORY_OP.loading));

	const res = favourite
		? await api.deleteSavedStory(favourite.id)
		: await api.createSavedStory({user: userId, story: storyId});

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id) {
		dispatch(gotData({data: res}));
		return dispatch(gotSaved({...res, storyId}));
	}
	dispatch(removeSaved({storyId, savedId: favourite.id}));
	return dispatch(removeSavedStory(favourite.id));
};

const savedStories = state => state.saved_stories.data;

export const selectUserSavedStories = createSelector([savedStories], res =>
	res ? Object.values(res).map(item => item) : null
);

export default savedStorySlice.reducer;
