import {createSlice, createEntityAdapter, current} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';
import {NOTIFICATION_ACTIONS} from 'types/notifications';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const notificationsAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
});

export const notificationsSlice = createSlice({
	name: 'notifications',
	initialState: notificationsAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		totalNew: 0,
		total: 0,
	}),
	reducers: {
		notificationsReceieved: (state, action) => {
			notificationsAdapter.setAll(state, action.payload);
		},
		notificationsUpsertMany: (state, {payload}) => {
			notificationsAdapter.upsertMany(state, payload);
		},
		notificationsMarkAll: (state, {payload}) => {
			const {entities} = current(state);

			switch (payload.action) {
				case NOTIFICATION_ACTIONS.markAllNotNew:
					state.totalNew = 0;
					break;
				case NOTIFICATION_ACTIONS.markAllRead:
					notificationsAdapter.upsertMany(
						state,
						Object.values(entities).map(i => ({...i, read: true}))
					);
				default:
					break;
			}
		},
		notificationsUpsertOne: (state, {payload}) => {
			notificationsAdapter.upsertOne(state, payload);
		},
		notificationsAddOne: (state, {payload}) => {
			notificationsAdapter.addOne(state, payload);
			state.total += 1;

			if (payload.new) {
				state.totalNew += 1;
			} else {
				state.totalNew -= 1;
			}
		},

		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.totalNew = payload.totalNew;
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	notificationsReceieved,
	notificationsUpsertMany,
	notificationsMarkAll,
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
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const countRes = await api.countNotifications(countParams);
		if (countRes.error) {
			return batchDispatch([
				opEnd({op, error: countRes.error}),
				newToast({...Toast.error(countRes.error)}),
			]);
		}

		return batchDispatch([
			gotPages({total: countRes.total, totalNew: countRes.totalNew, limit: params._limit}),
			notificationsReceieved(res),
			opEnd({op}),
		]);
	}
	return batchDispatch([notificationsUpsertMany(res), opEnd({op})]);
};

export const updateNotification = payload => async dispatch => {
	const op = DEFAULT_OP.update;
	dispatch(opStart(op));
	const res = await api.updateNotification(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}
	return batchDispatch([notificationsUpsertOne(res), opEnd({op})]);
};

export const updateNotifications = payload => async dispatch => {
	const op = DEFAULT_OP.update;
	dispatch(opStart(op));
	const res = await api.updateNotifications(payload);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}),
			newToast({...Toast.error(res.error)}),
		]);
	}

	return batchDispatch([notificationsMarkAll({action: payload.action}), opEnd({op})]);
};

//SELECTORS

const notificationsSelector = notificationsAdapter.getSelectors(state => state.notifications);

export const selectNotifications = state => notificationsSelector.selectAll(state);
export const selectNotificationIds = state => notificationsSelector.selectIds(state);
export const selectNotification = (state, id) => notificationsSelector.selectById(state, id);

export default notificationsSlice.reducer;
