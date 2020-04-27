import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

export const storySlice = createSlice({
	name: 'stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = helper(action.payload);
			state.error = action.payload.error;
			state.loading = false;
		},
		loading: state => {
			state.loading = true;
		},
	},
});

const helper = arr =>
	arr.reduce((map, obj) => {
		map[obj.id] = obj;
		return map;
	}, {});

export const {logOut, hasError, gotData, loading} = storySlice.actions;

export const createStory = payload => (dispatch, getState) => {
	dispatch(loading());
	const state = getState();
	const {user} = state;

	api.createStory(user.data.token, payload).then(res => dispatch(gotData(res)));
};

export const loadStories = () => dispatch => {
	dispatch(loading());
	api.getStories().then(res => dispatch(gotData(res)));
};

export const loadStory = id => dispatch => {
	dispatch(loading());
	api.getStory(id).then(res => dispatch(gotData([res])));
};

//SELECTORS

const stories = state => state.stories.data;

export const selectStories = createSelector([stories], res =>
	res ? Object.values(res).map(item => item) : null
);

export const selectStory = (state, id) => state.stories.data && state.stories.data[id];

export default storySlice.reducer;
