import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const myStorySlice = createSlice({
	name: 'user_stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			const {data, invalidate} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate);
			state.loading = false;
		},
		removeStory: (state, action) => {
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

export const {loadingStart, loadingEnd, gotData, gotPages, removeStory} = myStorySlice.actions;

export const loadStories = (params, count, invalidate) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const res = await api.countStories(countParams);
		if (res.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(Math.ceil(res / 10)));
	}
	return dispatch(gotData({data: res}));
};

//SELECTORS

const stories = state => state.user_stories.data;

export const selectStories = createSelector([stories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export const selectStory = (state, id) => state.user_stories.data && state.user_stories.data[id];

export default myStorySlice.reducer;