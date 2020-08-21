import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import {Toast} from 'types/toast';

const toastAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.id.localeCompare(b.id),
});

export const toastSlice = createSlice({
	name: 'toast',
	initialState: toastAdapter.getInitialState(),
	reducers: {
		newToast: toastAdapter.upsertOne,
		dissmissToast: toastAdapter.removeOne,
	},
});

export const {newToast, dissmissToast} = toastSlice.actions;

export const addToast = (toast, type, title) => dispatch => {
	if (typeof toast === 'string') {
		toast = new Toast(toast, type, title);
	}
	dispatch(newToast({...toast}));
};

export const removeToast = id => dispatch => {
	dispatch(dissmissToast(id));
};

const toastsSelector = toastAdapter.getSelectors(state => state.toast);

export const selectToasts = state => toastsSelector.selectAll(state);

export default toastSlice.reducer;
