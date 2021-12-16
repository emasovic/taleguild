import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const followingAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const followingSlice = createSlice({
	name: 'following',
	initialState: followingAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		currentPage: 1,
	}),
	reducers: {
		followingReceieved: (state, action) => {
			followingAdapter.setAll(state, action.payload);
			state.op = null;
		},
		followingUpsertMany: (state, action) => {
			followingAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.op = null;
		},
		followingUpsertOne: (state, {payload}) => {
			followingAdapter.upsertOne(state, payload);
			state.total += 1;
			state.op = null;
		},
		followingRemoveOne: (state, {payload}) => {
			followingAdapter.removeOne(state, payload);
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
	followingReceieved,
	followingUpsertMany,
	followingUpsertOne,
	followingRemoveOne,
} = followingSlice.actions;

export const loadFollowing = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
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

		return dispatch(followingReceieved(res));
	}

	return dispatch(followingUpsertMany(res));
};

export const createOrDeleteFollowing = ({follower, userId, followerId}, op) => async dispatch => {
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
		return dispatch(followingUpsertOne(res));
	}

	return dispatch(followingRemoveOne(follower.id));
};

//SELECTORS

const followingSelector = followingAdapter.getSelectors(state => state.following);

export const selectFollowing = state => followingSelector.selectAll(state);
export const selectFollowingIds = state => followingSelector.selectIds(state);
export const selectFollowingById = (state, id) => followingSelector.selectById(state, id);

export default followingSlice.reducer;
