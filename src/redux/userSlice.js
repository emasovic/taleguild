import {createSlice} from '@reduxjs/toolkit';

import * as api from '../lib/api';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		token: null,
		data: null,
		error: null,
		loading: false,
	},
	reducers: {
		logOut: state => {
			state.token = null;
			state.data = null;
		},
		gotData: (state, action) => {
			state.token = action.payload.jwt;
			state.data = action.payload.user;
			state.error = action.payload.error;
			state.loading = false;
		},
		loading: state => {
			state.loading = true;
		},
	},
});

export const {logOut, hasError, gotData, loading} = userSlice.actions;

export const loginUser = payload => dispatch => {
	dispatch(loading());
	api.loginUser(payload).then(res => {
		if (!res.error) {
			localStorage.setItem('token', res.jwt);
		}
		dispatch(gotData(res));
	});
};

export const logOutUser = () => dispatch => {
	localStorage.removeItem('token');
	dispatch(logOut());
};

export const getUser = () => dispatch => {
	const token = localStorage.getItem('token');
	if (token) {
		api.getUserInfo(token).then(res => {
			if (res.error) {
				return localStorage.removeItem('token');
			}
			dispatch(gotData({user: res, jwt: token}));
		});
	}
};

export const selectUser = state => state.user.data;

export default userSlice.reducer;
