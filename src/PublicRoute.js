import React, {useEffect, useState} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {HOME} from 'lib/routes';

import {selectUser} from 'redux/user';

import Loader from 'components/widgets/loader/Loader';

const PublicRoute = ({component: Component, ...rest}) => {
	const user = useSelector(selectUser);
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	useEffect(() => {
		let token = localStorage.getItem('token');
		if (!token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [user]);

	if (isAuthenticated === null) {
		return <Loader />;
	}

	return (
		<Route
			{...rest}
			render={props => (!isAuthenticated ? <Redirect to={HOME} /> : <Component {...props} />)}
		/>
	);
};

PublicRoute.propTypes = {
	component: PropTypes.element,
};

export default PublicRoute;
