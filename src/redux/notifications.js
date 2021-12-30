import {createSlice, createEntityAdapter, current} from '@reduxjs/toolkit';

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
		op: DEFAULT_OP.loading,
		pages: null,
		currentPage: 1,
		unseen: 0,
		total: 0,
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

			state.op = null;
		},
		notificationsMarkAllAsRead: state => {
			const {entities} = current(state);

			notificationsAdapter.upsertMany(
				state,
				Object.values(entities).map(i => ({...i, seen: true}))
			);
			state.unseen = 0;
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
		notificationsAddOne: (state, {payload}) => {
			notificationsAdapter.addOne(state, payload);
			state.total += 1;

			if (!payload.seen) {
				state.unseen += 1;
			} else {
				state.unseen -= 1;
			}
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
			state.pages = Math.ceil(payload.total / payload.limit);
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
	notificationsMarkAllAsRead,
	notificationsUpsertOne,
	notificationsAddOne,
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

		dispatch(gotPages({total: countRes.total, unseen: countRes.unseen, limit: params._limit}));
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

export const updateNotifications = payload => async (dispatch, getState) => {
	dispatch(opStart(DEFAULT_OP.update));
	const res = await api.updateNotifications(payload);
	if (res.error) {
		dispatch(opEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(notificationsMarkAllAsRead(res));
};

//SELECTORS

const notificationsSelector = notificationsAdapter.getSelectors(state => state.notifications);

export const selectNotifications = state => notificationsSelector.selectAll(state);
export const selectNotificationIds = state => notificationsSelector.selectIds(state);
export const selectNotification = (state, id) => notificationsSelector.selectById(state, id);

export default notificationsSlice.reducer;
