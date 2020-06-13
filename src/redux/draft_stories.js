import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {STORY_OP} from 'types/story';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const draftSlice = createSlice({
	name: 'drafts',
	initialState: {
		data: null,
		error: null,
		loading: false,
		op: null,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			const {data, invalidate} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate);
			state.loading = false;
			state.op = null;
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
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	opStart,
	opEnd,
	gotData,
	gotPages,
	removeStory,
} = draftSlice.actions;

export const loadStories = (params, count, op = STORY_OP.loading) => async dispatch => {
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
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(Math.ceil(res / 10)));
	}
	return dispatch(gotData({data: res}));
};

//SELECTORS

const stories = state => state.drafts.data;

export const selectStories = createSelector([stories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export const selectStory = (state, id) => state.drafts.data && state.drafts.data[id];

export default draftSlice.reducer;
