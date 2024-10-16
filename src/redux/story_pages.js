import {createSlice, createSelector, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {editStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {STORY_PAGE_OP} from 'types/story_page';

import {newToast} from './toast';
import {storyUpsert} from './story';

const storyPageAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const storyPageSlice = createSlice({
	name: 'story_pages',
	initialState: storyPageAdapter.getInitialState({op: null, pages: null, loading: null}),
	reducers: {
		storyPagesReceieved: (state, action) => {
			storyPageAdapter.setAll(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		storyPageUpsert: (state, action) => {
			storyPageAdapter.upsertOne(state, action.payload);
			state.loading = null;
			state.op = null;
		},
		storyPageRemoved: (state, action) => {
			storyPageAdapter.removeOne(state, action.payload);
			state.loading = null;
			state.op = null;
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
	storyPagesReceieved,
	storyPageUpsert,
	storyPageRemoved,
} = storyPageSlice.actions;

export const loadStoryPages = filter => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStoryPages(filter);

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (res[0] && res[0].story) {
		dispatch(storyUpsert(res[0].story));
	}

	dispatch(storyPagesReceieved(res));
};

export const loadStoryPage = payload => async dispatch => {
	if (!payload.id) {
		return null;
	}
	dispatch(loadingStart());

	const res = await api.getStoryPage(payload.id);

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(storyPageUpsert(res));
};

export const createOrUpdateStoryPage = payload => async (dispatch, getState, history) => {
	const op = payload.id ? STORY_PAGE_OP.update : STORY_PAGE_OP.create;
	dispatch(opStart(op));

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
		return dispatch(storyPageUpsert(res));
	}
	return dispatch(opEnd());
};

export const deleteStoryPage = (storyId, pageId) => async (dispatch, getState, history) => {
	dispatch(opStart(STORY_PAGE_OP.remove));

	const res = await api.deleteStoryPage(pageId);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(storyPageRemoved(pageId));

	const {story_pages} = getState();

	const page = Object.keys(story_pages.entities)[0];

	page && history.push(editStory(storyId, page));

	return dispatch(newToast({...Toast.success('Successfully removed page!')}));
};

//SELECTORS

const globalizedSelectors = storyPageAdapter.getSelectors(state => state.story_pages);

export const allPages = state => globalizedSelectors.selectAll(state);

export const selectStoryPages = createSelector([allPages], res =>
	res ? res.map(item => ({...item, text: JSON.parse(item.text)})) : null
);

export default storyPageSlice.reducer;
