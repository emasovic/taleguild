import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const followingAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const followingSlice = createSlice({
	name: 'following',
	initialState: followingAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		followingReceieved: (state, action) => {
			followingAdapter.setAll(state, action.payload);
		},
		followingUpsertMany: (state, action) => {
			followingAdapter.upsertMany(state, action.payload);
		},
		followingUpsertOne: (state, {payload}) => {
			followingAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		followingRemoveOne: (state, {payload}) => {
			followingAdapter.removeOne(state, payload);
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
	followingReceieved,
	followingUpsertMany,
	followingUpsertOne,
	followingRemoveOne,
} = followingSlice.actions;

export const loadFollowing = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getFollowers(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {data, meta} = res;

	const action = !params?.pagination?.start ? followingReceieved : followingUpsertMany;

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

export const createOrDeleteFollowing = ({follower, userId, followerId}, op) => async dispatch => {
	op = op || follower?.id ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));
	const res = follower
		? await api.deleteFollower(follower.id)
		: await api.createFollower({user: userId, follower: followerId});

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const actions = [opEnd({op})];

	if (res.id) {
		actions.unshift(followingUpsertOne(res));
	} else {
		actions.unshift(followingRemoveOne(follower.id));
	}

	return batchDispatch(actions);
};

//SELECTORS

const followingSelector = followingAdapter.getSelectors(state => state.following);

export const selectFollowing = state => followingSelector.selectAll(state);
export const selectFollowingIds = state => followingSelector.selectIds(state);
export const selectFollowingById = (state, id) => followingSelector.selectById(state, id);

export default followingSlice.reducer;
