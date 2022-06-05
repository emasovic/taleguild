import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';

import {newToast} from './toast';
import {followersRemoveOne, followersUpsertOne} from './followers';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';
import {DEFAULT_OP} from 'types/default';

const usersAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

export const usersSlice = createSlice({
	name: 'users',
	initialState: usersAdapter.getInitialState({op: createOperations()}),
	reducers: {
		usersReceieved: (state, action) => {
			usersAdapter.upsertOne(state, action.payload);
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
	},
	extraReducers: {
		[followersRemoveOne]: (state, {payload}) => {
			if (state.entities[payload.user].followers?.length) {
				state.entities[payload.user].followers = [];
			}
		},
		[followersUpsertOne]: (state, {payload}) => {
			if (payload?.user) {
				state.entities[payload.user?.id].followers.push(payload);
			}
		},
	},
});

export const {usersReceieved, opStart, opEnd} = usersSlice.actions;

export const loadUser = username => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));
	const res = await api.getUser(username);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([usersReceieved(res), opEnd({op})]);
};

const usersSelector = usersAdapter.getSelectors(state => state.users);

export const selectUser = (state, id) => usersSelector.selectById(state, id);

export const selectUserByUsername = (state, username) => {
	const users = usersSelector.selectAll(state);
	const user = users.find(u => u.username === username);

	return user;
};

export default usersSlice.reducer;
