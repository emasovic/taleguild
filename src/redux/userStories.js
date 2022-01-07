import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const userStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.published_at.localeCompare(a.published_at),
});

export const myStorySlice = createSlice({
	name: 'userStories',
	initialState: userStoriesAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		userStoriesReceieved: (state, action) => {
			userStoriesAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		userStoryRemoved: (state, action) => {
			userStoriesAdapter.removeOne(state, action.payload);
			state.loading = null;

			state.total -= 1;
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
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
	loadingEnd,
	gotPages,
	userStoriesReceieved,
	userStoryRemoved,
} = myStorySlice.actions;

export const loadStories = params => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(gotPages({total: res.total, limit: params._limit}));
	return dispatch(userStoriesReceieved(res.data));
};

//SELECTORS

const userStoriesSelector = userStoriesAdapter.getSelectors(state => state.userStories);

export const selectStories = state => userStoriesSelector.selectAll(state);

export const selectStory = (state, id) => userStoriesSelector.selectById(state, id);

export default myStorySlice.reducer;
