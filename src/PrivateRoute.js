import React, {useEffect, useState} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {LOGIN} from 'lib/routes';

import {selectAuthUser} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';

const PrivateRoute = ({component: Component, ...rest}) => {
	const user = useSelector(selectAuthUser);
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	useEffect(() => {
		let token = localStorage.getItem('token');
		if (token) {
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
			render={props =>
				!isAuthenticated ? <Redirect to={LOGIN} /> : <Component {...props} />
			}
		/>
	);
};

PrivateRoute.propTypes = {
	component: PropTypes.any,
};

export default PrivateRoute;
