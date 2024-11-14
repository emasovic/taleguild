import {createSlice} from '@reduxjs/toolkit';

import {Toast} from 'types/toast';

import {getUser} from './auth';
import {loadCategories} from './categories';
import {loadLanguages} from './languages';
import {newToast} from './toast';

export const applicationSlice = createSlice({
	name: 'app',
	initialState: {
		showMobileNav: true,
		cropActive: false,
		initialized: null,
		loading: null,
	},
	reducers: {
		initialized: state => {
			state.initialized = true;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
		toggleCrop: (state, {payload}) => {
			state.cropActive = payload;
		},
		toggleMobileNav: (state, {payload}) => {
			state.showMobileNav = payload;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	initialized,
	toggleCrop,
	toggleMobileNav,
} = applicationSlice.actions;

export const initialize = () => dispatch => {
	dispatch(loadingStart());
	const promises = [dispatch(loadCategories()), dispatch(loadLanguages()), dispatch(getUser())];
	return Promise.all(promises)
		.then(() => dispatch(loadingEnd()))
		.catch(err => dispatch(newToast({...Toast.error(err)})));
};

export const selectApp = state => state.app;

export default applicationSlice.reducer;
