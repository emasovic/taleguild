import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const commentsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

export const commentsSlice = createSlice({
	name: 'comments',
	initialState: commentsAdapter.getInitialState({op: createOperations(), pages: null, total: 0}),
	reducers: {
		commentsReceieved: (state, action) => {
			commentsAdapter.setAll(state, action.payload);
		},
		commentsUpsertMany: (state, action) => {
			commentsAdapter.upsertMany(state, action.payload);
		},
		commentsUpsertOne: (state, {payload}) => {
			commentsAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		commentsRemoveOne: (state, {payload}) => {
			commentsAdapter.removeOne(state, payload.id);
			state.total -= 1;
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	commentsReceieved,
	commentsUpsertMany,
	commentsUpsertOne,
	commentsRemoveOne,
	gotPages,
	opStart,
	opEnd,
} = commentsSlice.actions;

export const loadComments = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getComments(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? commentsReceieved : commentsUpsertMany;

	return batchDispatch([
		action(data),
		gotPages({
			total: meta.pagination.total,
			totalNew: meta.pagination.totalNew,
			limit: meta.pagination.limit,
		}),
		opEnd({op}),
	]);
};

export const createOrDeleteComment = payload => async (dispatch, getState) => {
	const op = payload.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));

	const res = payload.id ? await api.deleteComment(payload.id) : await api.createComment(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [opEnd({op})];

	if (!payload.id) {
		actions.unshift(commentsUpsertOne({storyId: payload.story, ...res}));
	} else {
		actions.unshift(commentsRemoveOne({storyId: payload.story, id: payload.id}));
	}

	return batchDispatch(actions);
};

//SELECTORS

const commentsSelector = commentsAdapter.getSelectors(state => state.comments);

export const selectComments = state => commentsSelector.selectAll(state);

export default commentsSlice.reducer;
