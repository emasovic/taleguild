import {createSlice} from '@reduxjs/toolkit';
import queryString from 'query-string';

import {getUser} from './user';
import {loadCategories} from './categories';

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
	dispatch(loadCategories());
	dispatch(getUser());
	dispatch(initialized());
};

export default applicationSlice.reducer;
