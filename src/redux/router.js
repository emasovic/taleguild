import qs from 'qs';
import {replace} from 'connected-react-router';

export const navigateToQuery = (queryOb, resetParamsOnChange) => (dispatch, getState) => {
	const {location} = getState().router;
	const query = qs.parse(location.search, {ignoreQueryPrefix: true});

	const q = resetParamsOnChange ? qs.stringify(queryOb) : qs.stringify({...query, ...queryOb});

	dispatch(replace({pathname: location.pathname, search: q}));
};
