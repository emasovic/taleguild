import {createSlice} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {HOME} from 'lib/routes';

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
			const {error, jwt, ...rest} = action.payload;
			state.data = {...rest, token: jwt};
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
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	dispatch(gotData({jwt, ...rest}));
};

export const registerUser = payload => async dispatch => {
	dispatch(loadingStart());
	const res = await api.registerUser(payload);

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);
	dispatch(gotData({jwt, ...rest}));
};

export const logOutUser = () => dispatch => {
	localStorage.removeItem('token');
	dispatch(logOut());
};

export const getUser = () => async dispatch => {
	const token = localStorage.getItem('token');

	if (!token) {
		return null;
	}

	dispatch(loadingStart());
	const res = await api.getUserInfo(token);
	if (res.error) {
		dispatch(loadingEnd());
		return localStorage.removeItem('token');
	}

	// dispatch(savedStoriesData(saved_stories));
	dispatch(gotData({...res, jwt: token}));
};

export const updateUser = (token, payload) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.updateUser(token, payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(newToast({...Toast.success('Successfully updated user settings!')}));
	dispatch(gotData({...res, jwt: token}));
};

export const forgotPassword = payload => async dispatch => {
	const res = await api.forgotPassword(payload);
	if (res.error) {
		if (Array.isArray(res.error)) {
			return dispatch(newToast({...Toast.error(res.error[0].message)}));
		}
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(
		newToast({...Toast.success('Soon you will get email with reset link!')})
	);
};

export const resetPassword = (payload, history) => async dispatch => {
	if (payload.password !== payload.passwordConfirmation) {
		return dispatch(newToast({...Toast.error('Passwords doesnt match!')}));
	}
	dispatch(loadingStart());
	const res = await api.resetPassword(payload);

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	localStorage.setItem('token', res.jwt);
	dispatch(gotData(res));
	history.push(HOME);
	dispatch(newToast({...Toast.success('Password successfully reset!')}));
};

export const selectUser = state => state.user;

export default userSlice.reducer;
