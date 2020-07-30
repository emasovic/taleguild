import {createSlice} from '@reduxjs/toolkit';
import queryString from 'query-string';

import {Toast} from 'types/toast';

import {getUser} from './user';
import {loadCategories} from './categories';
import {newToast} from './toast';

export const applicationSlice = createSlice({
	name: 'application',
	initialState: {
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
	},
});

export const {loadingStart, loadingEnd, initialized} = applicationSlice.actions;

export const navigateToQuery = (queryOb, location, history) => (dispatch, getState) => {
	const query = queryString.parse(location.search);

	const q = queryString.stringify({...query, ...queryOb});

	history.push({pathname: location.path, search: q});
};

export const initialize = () => dispatch => {
	const promises = [dispatch(loadCategories()), dispatch(getUser())];
	return Promise.all(promises)
		.then(() => dispatch(initialized()))
		.catch(err => dispatch(newToast({...Toast.error(err)})));
};

export default applicationSlice.reducer;
