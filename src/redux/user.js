import {createSlice} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {newToast} from './toast';
import {Toast} from 'types/toast';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		data: null,
		error: null,
		loading: false,
	},
	reducers: {
		logOut: state => {
			state.data = null;
		},
		gotData: (state, action) => {
			const {error, user, jwt} = action.payload;
			state.data = {...user, token: jwt};
			state.error = error;
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

export const {logOut, hasError, gotData, loadingStart, loadingEnd} = userSlice.actions;

export const loginUser = payload => async dispatch => {
	dispatch(loadingStart());
	const res = await api.loginUser(payload);
	if (!res.error) {
		localStorage.setItem('token', res.jwt);
	}
	dispatch(gotData(res));
};

export const registerUser = payload => async dispatch => {
	dispatch(loadingStart());
	const res = await api.registerUser(payload);
	if (!res.error) {
		localStorage.setItem('token', res.jwt);
	}
	dispatch(gotData(res));
};

export const logOutUser = () => dispatch => {
	localStorage.removeItem('token');
	dispatch(logOut());
};

export const getUser = () => async dispatch => {
	const token = localStorage.getItem('token');
	if (token) {
		dispatch(loadingStart());
		const res = await api.getUserInfo(token);
		if (res.error) {
			dispatch(loadingEnd());
			return localStorage.removeItem('token');
		}
		dispatch(gotData({user: res, jwt: token}));
	}
};

export const updateUser = (token, payload) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.updateUser(token, payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(newToast({...Toast.success('Uspešno ste izmenili podatke!')}));
	dispatch(gotData({user: res, jwt: token}));
};

export const selectUser = state => state.user;

export default userSlice.reducer;
