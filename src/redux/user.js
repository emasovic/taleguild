import {createSlice} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {HOME, WELCOME} from 'lib/routes';

import {newToast} from './toast';
import {Toast} from 'types/toast';
import {USER_OP} from 'types/user';

export const userSlice = createSlice({
	name: 'user',
	initialState: {
		data: null,
		error: null,
		op: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			const {error, jwt, ...rest} = action.payload;
			state.data = {...rest, token: jwt};
			state.error = error;
			state.loading = null;
			state.op = null;
		},
		opStart: (state, action) => {
			state.op = action.payload || true;
		},
		opEnd: state => {
			state.op = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		logOut: state => {
			state.data = null;
		},
	},
});

export const {logOut, opStart, opEnd, gotData, loadingStart, loadingEnd} = userSlice.actions;

export const loginUser = payload => async dispatch => {
	dispatch(opStart(USER_OP.login));
	const res = await api.loginUser(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	dispatch(gotData({jwt, ...rest}));
};

export const registerUser = (payload, history) => async dispatch => {
	dispatch(opStart(USER_OP.registring));
	const res = await api.registerUser(payload);

	if (res.error) {
		dispatch(opEnd());
		if (Array.isArray(res.error)) {
			return dispatch(
				newToast({...Toast.error(res.error[0].messages[0].message || 'Bad request')})
			);
		}
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	dispatch(
		newToast({
			...Toast.success('Thank you for registring, check your email for confirmation link!'),
		})
	);
	dispatch(opEnd());
};

export const logOutUser = () => dispatch => {
	localStorage.removeItem('token');
	dispatch(logOut());
};

export const getUser = () => async (dispatch, getState) => {
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
		if (Array.isArray(res.error)) {
			return dispatch(
				newToast({...Toast.error(res.error[0].messages[0].message || 'Bad request')})
			);
		}
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(newToast({...Toast.success('Successfully updated user settings!')}));
	dispatch(gotData({...res, jwt: token}));
};

export const forgotPassword = payload => async dispatch => {
	dispatch(opStart(USER_OP.forgot_password));
	const res = await api.forgotPassword(payload);
	if (res.error) {
		dispatch(opEnd());
		if (Array.isArray(res.error)) {
			return dispatch(
				newToast({...Toast.error(res.error[0].messages[0].message || 'Bad request')})
			);
		}
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(opEnd());
	dispatch(newToast({...Toast.success('Soon you will get email with reset link!')}));
};

export const resetPassword = (payload, history) => async dispatch => {
	if (payload.password !== payload.passwordConfirmation) {
		return dispatch(newToast({...Toast.error('Passwords doesn`t match!')}));
	}
	dispatch(opStart(USER_OP.reset_password));
	const res = await api.resetPassword(payload);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	localStorage.setItem('token', res.jwt);
	dispatch(gotData(res));
	history.push(HOME);
	dispatch(newToast({...Toast.success('Password successfully reset!')}));
};

export const providerLogin = (provider, token, history) => async dispatch => {
	dispatch(opStart(USER_OP.login));
	const res = await api.loginProvider(provider, token);

	if (res.error) {
		dispatch(opEnd());
		if (Array.isArray(res.error)) {
			return dispatch(
				newToast({...Toast.error(res.error[0].messages[0].message || 'Bad request')})
			);
		}
		return dispatch(newToast({...Toast.error(res.error.detail || res.error)}));
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	dispatch(gotData({jwt, ...rest}));
	history.push(WELCOME);
};

export const selectUser = state => state.user;

export const loggedUserId = state => state.user.data && state.user.data.id;

export default userSlice.reducer;
