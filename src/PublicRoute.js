import React, {useEffect, useState} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {DASHBOARD} from 'lib/routes';

import {selectAuthUser} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';

const PublicRoute = ({component: Component, ...rest}) => {
	const user = useSelector(selectAuthUser);
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	useEffect(() => {
		let token = localStorage.getItem('token');
		if (!token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [user]);

	if (isAuthenticated === null) return <Loader />;
	return (
		<Route
			{...rest}
			render={props =>
				!isAuthenticated ? <Redirect to={DASHBOARD} /> : <Component {...props} />
			}
		/>
	);
};

PublicRoute.propTypes = {
	component: PropTypes.object,
};

export default PublicRoute;
