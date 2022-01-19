import queryString from 'query-string';
import {replace} from 'connected-react-router';

export const navigateToQuery = (queryOb, resetParamsOnChange) => (dispatch, getState) => {
	const {location} = getState().router;
	const query = queryString.parse(location.search);

	const q = resetParamsOnChange
		? queryString.stringify(queryOb)
		: queryString.stringify({...query, ...queryOb});

	dispatch(replace({pathname: location.pathname, search: q}));
};
