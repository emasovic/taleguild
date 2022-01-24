import {createSlice, createSelector, createEntityAdapter} from '@reduxjs/toolkit';
import {push} from 'connected-react-router';

import * as api from '../lib/api';
import {editStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const storyPageAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const storyPageSlice = createSlice({
	name: 'storyPages',
	initialState: storyPageAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
	}),
	reducers: {
		storyPagesReceieved: (state, action) => {
			storyPageAdapter.setAll(state, action.payload);
		},
		storyPageUpsert: (state, action) => {
			storyPageAdapter.upsertOne(state, action.payload);
		},
		storyPageRemoved: (state, action) => {
			storyPageAdapter.removeOne(state, action.payload);
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
	loadingStart,
	opStart,
	opEnd,
	loadingEnd,
	storyPagesReceieved,
	storyPageUpsert,
	storyPageRemoved,
} = storyPageSlice.actions;

export const loadStoryPages = filter => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));

	const res = await api.getStoryPages(filter);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	return batchDispatch([storyPagesReceieved(res), opEnd({op})]);
};

export const loadStoryPage = payload => async dispatch => {
	if (!payload.id) return null;

	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));

	const res = await api.getStoryPage(payload.id);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([storyPageUpsert(res), opEnd({op})]);
};

export const createOrUpdateStoryPage = payload => async dispatch => {
	const op = payload.id ? DEFAULT_OP.update : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = payload.id
		? await api.updateStoryPage(payload)
		: await api.createStoryPage(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [opEnd({op})];

	if (!payload.id) {
		actions.push(push(editStory(payload.story, res.id)));

		actions.unshift(storyPageUpsert(res));
	}
	return batchDispatch(actions);
};

export const deleteStoryPage = (storyId, pageId) => async (dispatch, getState) => {
	const op = DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = await api.deleteStoryPage(pageId);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [storyPageRemoved(pageId), opEnd({op})];

	const {
		storyPages: {ids},
	} = getState();

	const page = ids[ids.length - 1];

	page && actions.push(push(editStory(storyId, page)));

	batchDispatch(actions);
};

//SELECTORS

const storyPagesSelector = storyPageAdapter.getSelectors(state => state.storyPages);

export const storyPages = state => storyPagesSelector.selectAll(state);

export const selectStoryPages = createSelector([storyPages], res =>
	res ? res.map(item => ({...item, text: JSON.parse(item.text)})) : null
);

export const selectStoryPage = (state, id) => {
	const storypage = storyPagesSelector.selectById(state, id);
	if (!storypage) {
		return null;
	}
	return {...storypage, text: JSON.parse(storypage.text)};
};

export default storyPageSlice.reducer;
