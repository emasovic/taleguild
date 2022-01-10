import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const followersAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const followersSlice = createSlice({
	name: 'followers',
	initialState: followersAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		total: 0,
		currentPage: 1,
	}),
	reducers: {
		followersReceieved: (state, action) => {
			followersAdapter.setAll(state, action.payload);
			state.op = null;
		},
		followersUpsertMany: (state, action) => {
			followersAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.op = null;
		},
		followersUpsertOne: (state, {payload}) => {
			followersAdapter.upsertOne(state, payload);
			state.total += 1;
			state.op = null;
		},
		followersRemoveOne: (state, {payload}) => {
			followersAdapter.removeOne(state, payload.id);
			state.total -= 1;
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
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
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countFollowers(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

		return dispatch(followersReceieved(res));
	}

	return dispatch(followersUpsertMany(res));
};

export const createOrDeleteFollower = ({follower, userId, followerId}, op) => async dispatch => {
	op = op || follower?.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));
	const res = follower
		? await api.deleteFollower(follower.id)
		: await api.createFollower({user: userId, follower: followerId});

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id) {
		return dispatch(followersUpsertOne(res));
	}

	return dispatch(followersRemoveOne({id: follower.id, user: userId}));
};

//SELECTORS

const followersSelector = followersAdapter.getSelectors(state => state.followers);

export const selectFollowers = state => followersSelector.selectAll(state);
export const selectFollowersIds = state => followersSelector.selectIds(state);
export const selectFollowersById = (state, id) => followersSelector.selectById(state, id);

export default followersSlice.reducer;
