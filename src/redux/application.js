import {createSlice} from '@reduxjs/toolkit';
import queryString from 'query-string';

export const applicationSlice = createSlice({
	name: 'application',
	initialState: {
		initialized: null,
	},
	reducers: {},
});

// export const {} = applicationSlice.actions;

export const navigateToQuery = (queryOb, location, history) => (dispatch, getState) => {
	const query = queryString.parse(location.search);

	const q = queryString.stringify({...query, ...queryOb});

	history.push({pathname: location.path, search: q});
};

export default applicationSlice.reducer;
