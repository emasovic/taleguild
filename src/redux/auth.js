import {createSlice} from '@reduxjs/toolkit';
import {push} from 'connected-react-router';

import * as api from 'lib/api';
import {DASHBOARD, WELCOME} from 'lib/routes';

import {Toast} from 'types/toast';
import {USER_OP} from 'types/user';
import {NOTIFICATION_TYPES} from 'types/notifications';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {notificationsAddOne} from './notifications';
import {userItemsUpsert} from './userItems';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

export const userSlice = createSlice({
	name: 'auth',
	initialState: {
		data: null,
		stats: null,
		op: createOperations(Object.keys(USER_OP)),
		loading: false,
	},
	reducers: {
		gotData: (state, action) => {
			const {jwt, points, coins, ...rest} = action.payload;
			state.data = {...rest, token: jwt};
			state.stats = {points, coins};
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
		logOut: state => {
			state.data = null;
			state.stats = {};
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
		[userItemsUpsert]: (state, {payload}) => {
			state.stats.coins -= payload.item?.price;
		},
	},
});

export const {logOut, opStart, opEnd, gotData, loadingStart, loadingEnd} = userSlice.actions;

export const loginUser = payload => async dispatch => {
	const op = USER_OP.login;
	dispatch(opStart(op));
	const res = await api.loginUser(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	return batchDispatch([gotData({jwt, ...rest}), opEnd({op})]);
};

export const registerUser = payload => async dispatch => {
	const op = USER_OP.registring;
	dispatch(opStart(op));
	const res = await api.registerUser(payload);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	batchDispatch([gotData({jwt, ...rest}), opEnd({op}), push(DASHBOARD)]);
};

export const logOutUser = () => dispatch => {
	const op = USER_OP.logout;
	dispatch(opStart(op));

	localStorage.removeItem('token');

	return batchDispatch([logOut(), opEnd({op})]);
};

export const getUser = () => async dispatch => {
	const token = localStorage.getItem('token');

	if (!token) return null;

	const op = USER_OP.loading;
	dispatch(opStart(op));
	const res = await api.getUserInfo(token);
	if (res.error) {
		dispatch(opEnd({op, error: res.error}));
		return localStorage.removeItem('token');
	}

	batchDispatch([gotData({...res, jwt: token}), opEnd({op})]);
};

export const updateUser = (token, payload) => async dispatch => {
	const op = DEFAULT_OP.update;
	dispatch(opStart(op));
	const res = await api.updateUser(token, payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([
		gotData({...res, jwt: token}),
		opEnd({op}),
		newToast({
			...Toast.success('The settings have been successfully updated.', 'Account Settings'),
		}),
	]);
};

export const forgotPassword = payload => async dispatch => {
	const op = USER_OP.forgot_password;
	dispatch(opStart(op));
	const res = await api.forgotPassword(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([
		opEnd({op}),
		newToast({
			...Toast.success(
				'We have sent a password recover instructions to your email. Please check your Spam folder if you cannot find it.',
				'Check your email'
			),
		}),
	]);
};

export const resetPassword = payload => async dispatch => {
	const op = USER_OP.reset_password;
	dispatch(opStart(op));
	const res = await api.resetPassword(payload);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	localStorage.setItem('token', res.jwt);
	const {jwt, user} = res;

	batchDispatch([
		gotData({jwt, ...user}),
		opEnd({op}),
		newToast({
			...Toast.success('The password has been successfully reset.', 'Password recovered'),
		}),
		push(DASHBOARD),
	]);
};

export const providerLogin = (provider, token) => async dispatch => {
	const op = USER_OP.provider_login;
	dispatch(opStart(op));
	const res = await api.loginProvider(provider, token);

	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error.detail || res.error)}),
		]);
	}
	const {jwt, user} = res;
	const {saved_stories, ...rest} = user;

	localStorage.setItem('token', res.jwt);

	batchDispatch([gotData({jwt, ...rest}), opEnd({op}), push(WELCOME)]);
};

export const selectAuthUser = state => state.auth;

export const selectUserId = state => state.auth.data && state.auth.data.id;

export default userSlice.reducer;
