import {createSlice} from '@reduxjs/toolkit';

import * as api from 'lib/api';
import {DASHBOARD, WELCOME} from 'lib/routes';

import {Toast} from 'types/toast';
import {USER_OP} from 'types/user';
import {NOTIFICATION_TYPES} from 'types/notifications';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {notificationsAddOne} from './notifications';

export const userSlice = createSlice({
	name: 'auth',
	initialState: {
		data: null,
		stats: null,
		op: null,
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			const {jwt, points, coins, ...rest} = action.payload;
			state.data = {...rest, token: jwt};
			state.stats = {points, coins};
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
	extraReducers: {
		[notificationsAddOne]: (state, {payload}) => {
			const {data = {}} = payload;
			const shouldReduce = payload.type === NOTIFICATION_TYPES.ITEM_BOUGHT;
			if (data?.coins) {
				state.stats.coins = shouldReduce
					? state.stats.coins - data.coins
					: state.stats.coins + data.coins;
			}
			if (data?.points) {
				state.stats.points = shouldReduce
					? state.stats.points - data.points
					: state.stats.points + data.points;
			}
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

export const registerUser = payload => async (dispatch, getState, history) => {
	dispatch(opStart(USER_OP.registring));
	const res = await api.registerUser(payload);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	dispatch(gotData({jwt, ...rest}));
	history.push(DASHBOARD);
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
	dispatch(opStart(DEFAULT_OP.update));
	const res = await api.updateUser(token, payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(
		newToast({
			...Toast.success('The settings have been successfully updated.', 'Account Settings'),
		})
	);
	dispatch(gotData({...res, jwt: token}));
};

export const forgotPassword = payload => async dispatch => {
	dispatch(opStart(USER_OP.forgot_password));
	const res = await api.forgotPassword(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(opEnd());
	dispatch(
		newToast({
			...Toast.success(
				'We have sent a password recover instructions to your email. Please check your Spam folder if you cannot find it.',
				'Check your email'
			),
		})
	);
};

export const resetPassword = payload => async (dispatch, getState, history) => {
	if (payload.password !== payload.passwordConfirmation) {
		return dispatch(
			newToast({
				...Toast.error(
					'Passwords do not match',
					'Please try re-entering the correct passwords.'
				),
			})
		);
	}
	dispatch(opStart(USER_OP.reset_password));
	const res = await api.resetPassword(payload);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	localStorage.setItem('token', res.jwt);
	dispatch(gotData(res));
	history.push(DASHBOARD);
	dispatch(
		newToast({
			...Toast.success('The password has been successfully reset.', 'Password recovered'),
		})
	);
};

export const providerLogin = (provider, token) => async (dispatch, getState, history) => {
	dispatch(opStart(USER_OP.provider_login));
	const res = await api.loginProvider(provider, token);

	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error.detail || res.error)}));
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	dispatch(gotData({jwt, ...rest}));
	history.push(WELCOME);
};

export const selectAuthUser = state => state.auth;

export const selectUserId = state => state.auth.data && state.auth.data.id;

export default userSlice.reducer;
