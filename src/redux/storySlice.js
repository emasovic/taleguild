import {createSlice} from '@reduxjs/toolkit';

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
			state.data = action.payload;
			state.error = action.payload.error;
			state.loading = false;
		},
		loading: state => {
			state.loading = true;
		},
	},
});

export const {logOut, hasError, gotData, loading} = storySlice.actions;

export const createStory = payload => (dispatch, getState) => {
	dispatch(loading());
	const state = getState();
	const {user} = state;

	api.createStory(user.token, payload).then(res => dispatch(gotData(res)));
};

export const loadStories = () => dispatch => {
	dispatch(loading());
	api.getStories().then(res => dispatch(gotData(res)));
};

export const selectStories = state => state.stories.data;

export default storySlice.reducer;
