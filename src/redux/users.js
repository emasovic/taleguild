import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {newToast} from './toast';
import {Toast} from 'types/toast';

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

export default usersSlice.reducer;
