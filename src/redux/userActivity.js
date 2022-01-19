import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {selectStory} from './story';
import {selectAuthUser} from './auth';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const userActivityAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const userActivitySlice = createSlice({
	name: 'userActivity',
	initialState: userActivityAdapter.getInitialState({
		op: createOperations(),
		pages: null,
	}),
	reducers: {
		userActivityReceieved: (state, {payload}) => {
			userActivityAdapter.setAll(state, payload);
		},
		userActivityUpsertMany: (state, {payload}) => {
			userActivityAdapter.upsertMany(state, payload);
		},
		userActivityUpsertOne: (state, {payload}) => {
			userActivityAdapter.upsertOne(state, payload);
			state.total += 1;
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
	userActivityReceieved,
	userActivityUpsertMany,
	userActivityUpsertOne,
	gotPages,
	opStart,
	opEnd,
} = userActivitySlice.actions;

export const loadUserActivity = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getActivity(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countActivity(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}
		return batchDispatch([
			userActivityReceieved(res),
			gotPages({total: countRes, limit: params._limit}),
			opEnd({op}),
		]);
	}

	return batchDispatch([userActivityUpsertMany(res), opEnd({op})]);
};

export const createUserActivity = payload => async (dispatch, getState) => {
	const state = getState();
	const {data} = selectAuthUser(state);
	const story = selectStory(state, payload.story);
	if (!data || !story) return null;

	const op = DEFAULT_OP.update;
	dispatch(opStart(op));
	const res = await api.createActivity(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	const actions = [opEnd({op})];

	res.id && actions.unshift(userActivityUpsertOne(res));
	dispatch(actions);
};

//SELECTORS

const userActivitySelector = userActivityAdapter.getSelectors(state => state.userActivity);

export const selectActivity = state => userActivitySelector.selectAll(state);
export const selectActivityIds = state => userActivitySelector.selectIds(state);

export default userActivitySlice.reducer;
