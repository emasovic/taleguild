import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
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
	if (!isAuthenticated) return <Navigate to={DASHBOARD} />;

	return <Component {...rest} />;
};

PublicRoute.propTypes = {
	component: PropTypes.object,
};

export default PublicRoute;
