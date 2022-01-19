import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const userStoriesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.published_at.localeCompare(a.published_at),
});

export const myStorySlice = createSlice({
	name: 'userStories',
	initialState: userStoriesAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		userStoriesReceieved: (state, action) => {
			userStoriesAdapter.setAll(state, action.payload);
		},
		userStoryRemoved: (state, action) => {
			userStoriesAdapter.removeOne(state, action.payload);
			state.total -= 1;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
	},
});

export const {
	opStart,
	opEnd,
	gotPages,
	userStoriesReceieved,
	userStoryRemoved,
} = myStorySlice.actions;

export const loadStories = params => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));
	const res = await api.getStories(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	return batchDispatch([
		userStoriesReceieved(res.data),
		gotPages({total: res.total, limit: params._limit}),
		opEnd({op}),
	]);
};

//SELECTORS

const userStoriesSelector = userStoriesAdapter.getSelectors(state => state.userStories);

export const selectStories = state => userStoriesSelector.selectAll(state);

export const selectStory = (state, id) => userStoriesSelector.selectById(state, id);

export default myStorySlice.reducer;
