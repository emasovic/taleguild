import React from 'react';
import {Route} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Loader from 'components/widgets/loader/Loader';

export default function PrivateRoute({component: Component, ...rest}) {
	const data = useSelector(state => state.user.data);

	return (
		<Route
			{...rest}
			render={props => (data && data.id ? <Component {...props} /> : <Loader />)}
		/>
	);
}
