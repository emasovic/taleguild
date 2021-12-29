import {createSlice} from '@reduxjs/toolkit';
import queryString from 'query-string';

import {Toast} from 'types/toast';

import {getUser} from './auth';
import {loadCategories} from './categories';
import {loadLanguages} from './languages';
import {newToast} from './toast';

export const applicationSlice = createSlice({
	name: 'application',
	initialState: {
		initialized: null,
		serviceWorkerInitialized: false,
		serviceWorkerUpdated: false,
		serviceWorkerRegistration: null,
		loading: null,
	},
	reducers: {
		initialized: state => {
			state.initialized = true;
		},
		serviceWorkerInitialize: state => {
			state.serviceWorkerInitialized = true;
		},
		serviceWorkerUpdate: (state, {payload}) => {
			state.serviceWorkerUpdated = true;
			state.serviceWorkerRegistration = payload;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	serviceWorkerInitialize,
	serviceWorkerUpdate,
	initialized,
} = applicationSlice.actions;

export const navigateToQuery = (queryOb, location, resetParamsOnChange) => (
	dispatch,
	getState,
	history
) => {
	const {location, push} = history;
	const query = queryString.parse(location.search);

	const q = resetParamsOnChange
		? queryString.stringify(queryOb)
		: queryString.stringify({...query, ...queryOb});

	push({pathname: location.path, search: q});
};

export const initialize = () => dispatch => {
	dispatch(loadingStart());
	const promises = [dispatch(loadCategories()), dispatch(loadLanguages()), dispatch(getUser())];
	return Promise.all(promises)
		.then(() => dispatch(loadingEnd()))
		.catch(err => dispatch(newToast({...Toast.error(err)})));
};

export default applicationSlice.reducer;
