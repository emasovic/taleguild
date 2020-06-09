import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {editStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {newToast} from './toast';
import {gotData as storyGotData} from './story';
import {gotDataHelper} from './hepler';
import sortBy from 'lodash/sortBy';

export const STORY_OP = {
	saving_storypage: 'saving_storypage',
	deleting_storypage: 'deleting_storypage',
};

export const storyPageSlice = createSlice({
	name: 'story_pages',
	initialState: {
		data: null,
		error: null,
		loading: false,
		op: null,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = gotDataHelper(state.data, action.payload);
			state.loading = false;
			state.op = null;
		},
		removeStoryPage: (state, action) => {
			delete state.data[action.payload];
			state.loading = null;
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
	removeStoryPage,
} = storyPageSlice.actions;

export const loadStoryPages = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStoryPages({'story.id': id});

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (res[0] && res[0].story) {
		dispatch(storyGotData([res[0].story]));
	}

	dispatch(gotData(res));
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

	dispatch(gotData({storyId: payload.story, ...res}));

	dispatch(opEnd());
};

export const deleteStoryPage = (storyId, pageId, history) => async (dispatch, getState) => {
	dispatch(opStart(STORY_OP.deleting_storypage));

	const res = await api.deleteStoryPage(pageId);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(removeStoryPage(pageId));

	const {saved_stories} = getState();

	const page = saved_stories[Object.keys(saved_stories)[0]];

	history.push(editStory(storyId, page && page.id));

	return dispatch(newToast({...Toast.success('Successfully removed page!')}));
};

//SELECTORS

const story_pages = state => state.story_pages.data;

export const selectStoryPages = createSelector([story_pages], res =>
	res
		? sortBy(
				Object.values(res).map(item => ({...item, text: JSON.parse(item.text)})),
				'created_at'
		  )
		: null
);

export default storyPageSlice.reducer;
