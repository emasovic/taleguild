import {createSlice, createEntityAdapter, createSelector} from '@reduxjs/toolkit';

import {
	getGuildatar,
	getGuildatars,
	createGuildatar,
	updateGuildatar,
	countGuildatars,
} from '../lib/api';

import {DEFAULT_OP} from 'types/default';
import {Toast} from 'types/toast';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const guildatarsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const guildatarsSlice = createSlice({
	name: 'guildatars',
	initialState: guildatarsAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		total: 0,
	}),
	reducers: {
		guildatarsReceieved: (state, action) => {
			guildatarsAdapter.setAll(state, action.payload);
		},
		guildatarsUpsertMany: (state, action) => {
			guildatarsAdapter.upsertMany(state, action.payload);
		},
		guildatarUpsert: (state, {payload}) => {
			guildatarsAdapter.upsertOne(state, payload);

			if (payload.isNew) {
				state.total += 1;
			}
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
	guildatarUpsert,
	guildatarsUpsertMany,
	guildatarsReceieved,
} = guildatarsSlice.actions;

export const createOrUpdateGuildatar = payload => async dispatch => {
	const op = payload.id ? DEFAULT_OP.update : DEFAULT_OP.delete;
	dispatch(opStart(op));

	const res = payload.id ? await updateGuildatar(payload) : await createGuildatar(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}
	const message = payload.id
		? 'The guildatar has been successfully updated.'
		: 'The guildatar has been successfully created.';

	dispatch(guildatarUpsert({...res, isNew: payload.id ? false : true}));
	dispatch(opEnd({op}));
	dispatch(newToast({...Toast.success(message)}));
};

export const loadGuildatars = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getGuildatars(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countGuildatars(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}
		return batchDispatch([
			gotPages({total: countRes, limit: params._limit}),
			guildatarsReceieved(res),
			opEnd({op}),
		]);
	}
	return batchDispatch([guildatarsUpsertMany(res), opEnd({op})]);
};

export const countAllGuildatars = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await countGuildatars(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}
	return batchDispatch([gotPages({total: res}), opEnd({op})]);
};

export const loadGuildatar = id => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));

	const res = await getGuildatar(id);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	return batchDispatch([guildatarUpsert(res), opEnd({op})]);
};

//SELECTORS

const guildatarsSelector = guildatarsAdapter.getSelectors(state => state.guildatars);

export const selectGuildatars = state => guildatarsSelector.selectAll(state);
export const selectGuildatarsIds = state => guildatarsSelector.selectIds(state);
export const selectGuildatarById = (state, id) => guildatarsSelector.selectById(state, id);
export const selectActiveGuildatar = createSelector([selectGuildatars], guildatars =>
	guildatars.find(i => i.active)
);

export default guildatarsSlice.reducer;
