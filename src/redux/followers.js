import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const followersAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const followersSlice = createSlice({
	name: 'followers',
	initialState: followersAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		followersReceieved: (state, action) => {
			followersAdapter.setAll(state, action.payload);
		},
		followersUpsertMany: (state, action) => {
			followersAdapter.upsertMany(state, action.payload);
		},
		followersUpsertOne: (state, {payload}) => {
			followersAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		followersRemoveOne: (state, {payload}) => {
			followersAdapter.removeOne(state, payload.id);
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
	followersReceieved,
	followersUpsertMany,
	followersUpsertOne,
	followersRemoveOne,
} = followersSlice.actions;

export const loadFollowers = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getFollowers(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countFollowers(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}
		return batchDispatch([
			gotPages({total: countRes, limit: params._limit}),
			followersReceieved(res),
			opEnd({op}),
		]);
	}
	return batchDispatch([followersUpsertMany(res), opEnd({op})]);
};

export const createOrDeleteFollower = ({follower, userId, followerId}, op) => async dispatch => {
	op = op || follower?.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));
	const res = follower
		? await api.deleteFollower(follower.id)
		: await api.createFollower({user: userId, follower: followerId});

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	const actions = [opEnd({op})];

	if (res.id) {
		actions.unshift(followersUpsertOne(res));
	} else {
		actions.unshift(followersRemoveOne({id: follower.id, user: userId}));
	}

	return dispatch(actions);
};

//SELECTORS

const followersSelector = followersAdapter.getSelectors(state => state.followers);

export const selectFollowers = state => followersSelector.selectAll(state);
export const selectFollowersIds = state => followersSelector.selectIds(state);
export const selectFollowersById = (state, id) => followersSelector.selectById(state, id);

export default followersSlice.reducer;
