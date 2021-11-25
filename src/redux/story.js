import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import orderBy from 'lodash.orderby';

import * as api from '../lib/api';
import {goToStory, editStory, DELETED_STORY} from '../lib/routes';

import {Toast} from 'types/toast';
import {DEFAULT_STORYPAGE_DATA, SORT_DIRECTION, STORY_OP, STORY_SORT} from 'types/story';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {savedStoryRemoved, savedStoryUpsert} from './savedStories';
import {storyPagesReceieved} from './storyPages';
import {archivedStoryRemoved, archivedStoryUpsert} from './archivedStories';
import {likesRemoveOne, likesUpsertOne} from './likes';
import {commentsRemoveOne, commentsUpsertOne} from './comments';

const storyAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const storySlice = createSlice({
	name: 'stories',
	initialState: storyAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		loading: null,
		currentPage: 1,
	}),
	reducers: {
		storiesReceieved: (state, action) => {
			storyAdapter.setAll(state, action.payload);
			state.loading = false;
			state.op = null;
		},
		storiesUpsertMany: (state, action) => {
			storyAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.loading = null;
			state.op = null;
		},
		storyRemoved: (state, action) => {
			storyAdapter.removeOne(state, action.payload);
			state.op = null;
			state.loading = null;
		},
		storyUpsert: (state, action) => {
			storyAdapter.upsertOne(state, action.payload);
			state.op = null;
			state.loading = null;
		},
		gotPages: (state, action) => {
			state.pages = Math.ceil(action.payload / 10);
			state.total = action.payload;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = false;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
	extraReducers: {
		[savedStoryUpsert]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].saved_by.push({...rest});
		},
		[savedStoryRemoved]: (state, {payload}) => {
			const {storyId, savedId} = payload;
			if (state.entities[storyId]) {
				state.entities[storyId] = {
					...state.entities[storyId],
					saved_by: state.entities[storyId].saved_by.filter(s => s.id !== savedId),
				};
			}
		},
		[storyPagesReceieved]: (state, {payload}) => {
			storyAdapter.upsertOne(state, payload?.[0]?.story);
		},
		[archivedStoryUpsert]: (state, {payload}) => {
			const {keepArchived} = payload;

			keepArchived
				? storyAdapter.upsertOne(state, payload)
				: storyAdapter.removeOne(state, payload.id);
		},
		[archivedStoryRemoved]: (state, {payload}) => {
			storyAdapter.upsertOne(state, payload);
		},
		[likesUpsertOne]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].likes.push({...rest});
		},
		[likesRemoveOne]: (state, {payload}) => {
			const {storyId, id: likeId} = payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				likes: state.entities[storyId].likes.filter(l => l.id !== likeId),
			};
		},
		[commentsUpsertOne]: (state, {payload}) => {
			const {storyId, ...rest} = payload;
			state.entities[storyId].comments.push({...rest});
		},
		[commentsRemoveOne]: (state, {payload}) => {
			const {storyId, id: commentId} = payload;
			state.entities[storyId] = {
				...state.entities[storyId],
				comments: state.entities[storyId].comments.filter(c => c.id !== commentId),
			};
		},
	},
});

export const {
	loadingStart,
	opStart,
	opEnd,
	loadingEnd,
	storiesReceieved,
	storiesUpsertMany,
	storyUpsert,
	storyRemoved,
	gotPages,
} = storySlice.actions;

export const newStory = payload => async (dispatch, getState, history) => {
	dispatch(loadingStart());

	const res = await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	const page = await api.createStoryPage({story: res.id, text: DEFAULT_STORYPAGE_DATA});

	if (page.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
	return history.push(editStory(res.id, page.id));
};

export const createOrUpdateStory = (payload, shouldChange = true) => async (
	dispatch,
	getState,
	history
) => {
	dispatch(loadingStart());

	const res = payload.id ? await api.updateStory(payload) : await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
	const message = payload.id ? 'Successfully updated story.' : 'Successfully created story.';
	if (shouldChange) {
		history.push(goToStory(res.id));
		dispatch(newToast({...Toast.success(message)}));
	}
};

export const deleteStory = storyId => async (dispatch, getState, history) => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyRemoved(storyId));
	dispatch(newToast({...Toast.success('Successfully deleted story.')}));
	return history.push(DELETED_STORY);
};

export const loadStories = (params, count, op = STORY_OP.loading) => async (dispatch, getState) => {
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countStories(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages(countRes));

		return dispatch(storiesReceieved(res));
	}

	return dispatch(storiesUpsertMany(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStory(id);

	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(storyUpsert(res));
};

export const createOrUpdateViews = (id, userId) => async dispatch => {
	dispatch(opStart());

	const res = await api.createOrUpdateViews({
		storyId: id,
		userAgent: navigator.userAgent,
		userId,
	});
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(opEnd());
};

//SELECTORS

const storySelector = storyAdapter.getSelectors(state => state.stories);

export const selectStories = (state, sort = STORY_SORT.created_at) => {
	let stories = storySelector.selectAll(state);

	stories = stories.length ? orderBy(stories, [sort], [SORT_DIRECTION.desc]) : stories;

	return stories;
};

export const selectStory = (state, id) => storySelector.selectById(state, id);

export default storySlice.reducer;
