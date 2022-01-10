import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';

import {newToast} from './toast';
import {followersRemoveOne, followersUpsertOne} from './followers';

const usersAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const usersSlice = createSlice({
	name: 'users',
	initialState: usersAdapter.getInitialState({loading: null}),
	reducers: {
		usersReceieved: (state, action) => {
			usersAdapter.upsertOne(state, action.payload);
			state.loading = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = null;
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
				state.entities[payload.user?.id].followers.push({
					...payload,
					follower: payload?.follower?.id,
					user: payload?.user?.id,
				});
			}
		},
	},
});

export const {usersReceieved, loadingStart, loadingEnd} = usersSlice.actions;

export const loadUser = id => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getUser(id);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(usersReceieved(res));
};

const usersSelector = usersAdapter.getSelectors(state => state.users);

export const selectUser = (state, id) => usersSelector.selectById(state, id);

export const selectUserByUsername = (state, username) => {
	const users = usersSelector.selectAll(state);
	const user = users.find(u => u.username === username);

	return user;
};

export default usersSlice.reducer;
