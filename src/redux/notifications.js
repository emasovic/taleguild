import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const notificationsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: notificationsAdapter.getInitialState({
		op: null,
		pages: null,
		currentPage: 1,
		unseen: 0,
	}),
	reducers: {
		notificationsReceieved: (state, action) => {
			notificationsAdapter.setAll(state, action.payload);
			state.op = null;
		},
		notificationsUpsertMany: (state, {payload}) => {
			notificationsAdapter.upsertMany(state, payload);

			if (state.op === DEFAULT_OP.load_more) {
				state.currentPage += 1;
			}

			if (!payload.seen) {
				state.unseen += 1;
			}

			state.op = null;
		},
		notificationsUpsertOne: (state, {payload}) => {
			notificationsAdapter.upsertOne(state, payload);

			if (!payload.seen) {
				state.unseen += 1;
			} else {
				state.unseen -= 1;
			}

			state.op = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		opStart: (state, action) => {
			state.op = action.payload;
		},
		opEnd: state => {
			state.op = null;
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / 10);
			state.unseen = payload.unseen;
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	notificationsReceieved,
	notificationsUpsertMany,
	notificationsUpsertOne,
	gotPages,
	opStart,
	opEnd,
} = notificationsSlice.actions;

export const loadNotifications = (params, count, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getNotifications(params);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countNotifications(countParams);
		if (countRes.error) {
			dispatch(opEnd());
			return dispatch(newToast({...Toast.error(countRes.error)}));
		}

		dispatch(gotPages(countRes));
		return dispatch(notificationsReceieved(res));
	}

	return dispatch(notificationsUpsertMany(res));
};

export const updateNotification = payload => async dispatch => {
	dispatch(opStart(DEFAULT_OP.update));
	const res = await api.updateNotification(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(notificationsUpsertOne(res));
};

//SELECTORS

const notificationsSelector = notificationsAdapter.getSelectors(state => state.notifications);

export const selectNotifications = state => notificationsSelector.selectAll(state);
export const selectNotificationIds = state => notificationsSelector.selectIds(state);
export const selectNotification = (state, id) => notificationsSelector.selectById(state, id);

export default notificationsSlice.reducer;
