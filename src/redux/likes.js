import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const likesAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const likesSlice = createSlice({
	name: 'likes',
	initialState: likesAdapter.getInitialState({op: createOperations(), total: 0, pages: null}),
	reducers: {
		likesReceieved: (state, action) => {
			likesAdapter.setAll(state, action.payload);
		},
		likesUpsertMany: (state, action) => {
			likesAdapter.upsertMany(state, action.payload);
		},
		likesUpsertOne: (state, {payload}) => {
			likesAdapter.upsertOne(state, payload);
			state.total += 1;
		},
		likesRemoveOne: (state, {payload}) => {
			likesAdapter.removeOne(state, payload.id);
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
	likesReceieved,
	likesUpsertMany,
	likesUpsertOne,
	likesRemoveOne,
	gotPages,
	opStart,
	opEnd,
} = likesSlice.actions;

export const loadLikes = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getLikes(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countLikes(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}

		return batchDispatch([
			gotPages({total: countRes, limit: params._limit}),
			likesReceieved(res),
			opEnd({op}),
		]);
	}

	return batchDispatch([likesUpsertMany(res), opEnd({op})]);
};

export const createOrDeleteLike = (like, userId, storyId) => async dispatch => {
	const op = like ? DEFAULT_OP.delete : DEFAULT_OP.create;
	dispatch(opStart(op));
	const res = like
		? await api.deleteLike(like.id)
		: await api.createLike({user: userId, story: storyId});

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	const actions = [opEnd({op})];

	if (res.id && !like) {
		actions.unshift(likesUpsertOne({storyId, ...res}));
	} else {
		actions.unshift(likesRemoveOne({storyId, id: like.id}));
	}

	return dispatch(actions);
};

//SELECTORS

const likesSelector = likesAdapter.getSelectors(state => state.likes);

export const selectLikes = state => likesSelector.selectAll(state);

export default likesSlice.reducer;
