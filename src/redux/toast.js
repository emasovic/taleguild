import {createSlice} from '@reduxjs/toolkit';

import {Toast} from 'types/toast';

export const toastSlice = createSlice({
	name: 'toast',
	initialState: {
		toasts: null,
	},
	reducers: {
		newToast: (state, action) => {
			let toasts = Object.assign({}, state.toasts);
			toasts[action.payload.id] = action.payload;
			state.toasts = toasts;
		},
		dissmissToast: (state, action) => {
			if (state.toasts && state.toasts[action.payload]) {
				let toasts = Object.assign({}, state.toasts);
				delete toasts[action.payload];
				state.toasts = toasts;
			} else {
				return state;
			}
		},
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

export const selectToasts = state => state.toast.toasts;

export default toastSlice.reducer;
