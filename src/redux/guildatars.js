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

const guildatarsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const guildatarsSlice = createSlice({
	name: 'guildatars',
	initialState: guildatarsAdapter.getInitialState({
		op: null,
		pages: null,
		total: null,
		currentPage: 1,
	}),
	reducers: {
		guildatarsReceieved: (state, action) => {
			guildatarsAdapter.setAll(state, action.payload);
			state.op = null;
		},
		guildatarsUpsertMany: (state, action) => {
			guildatarsAdapter.upsertMany(state, action.payload);
			if (state.op === DEFAULT_OP.load_more) state.currentPage += 1;
			state.op = null;
		},
		guildatarUpsert: (state, {payload}) => {
			guildatarsAdapter.upsertOne(state, payload);
			state.op = null;

			if (payload.isNew) {
				state.total += 1;
			}
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
		opStart: (state, action) => {
			state.op = action.payload || DEFAULT_OP.loading;
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
	guildatarUpsert,
	guildatarsUpsertMany,
	guildatarsReceieved,
} = guildatarsSlice.actions;

export const createOrUpdateGuildatar = payload => async (dispatch, getState, history) => {
	dispatch(opStart());

	const res = payload.id ? await updateGuildatar(payload) : await createGuildatar(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	const message = payload.id
		? 'The guildatar has been successfully updated.'
		: 'The guildatar has been successfully created.';

	dispatch(guildatarUpsert({...res, isNew: payload.id ? false : true}));
	dispatch(newToast({...Toast.success(message)}));
};

export const loadGuildatars = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await getGuildatars(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await countGuildatars(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}
		dispatch(gotPages({total: countRes, limit: params._limit}));

		return dispatch(guildatarsReceieved(res));
	}

	return dispatch(guildatarsUpsertMany(res));
};

export const countAllGuildatars = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await countGuildatars(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(opEnd());
	dispatch(gotPages(res));
};

export const loadGuildatar = id => async dispatch => {
	dispatch(opStart());

	const res = await getGuildatar(id);

	if (res.error) {
		dispatch(opEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(guildatarUpsert(res));
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
