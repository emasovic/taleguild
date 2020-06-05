import {createSlice} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {newToast} from './toast';
// import {gotData as savedStoriesData} from './saved_stories';
import {Toast} from 'types/toast';
import {gotDataHelper} from './hepler';

export const usersSlice = createSlice({
	name: 'users',
	initialState: {
		data: null,
		error: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = gotDataHelper(state.data, action.payload);
			state.loading = false;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

export const {gotData, loadingStart, loadingEnd} = usersSlice.actions;

export const loadUser = id => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getUser(id);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(gotData(res));
};

export const selectUser = (state, id) => state.users.data && state.users.data[id];

export default usersSlice.reducer;
