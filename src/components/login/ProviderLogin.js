import React, {useEffect} from 'react';
import {useLocation, useParams, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {providerLogin} from 'redux/user';

import NotFound from 'NotFound';

export default function ProviderLogin() {
	const dispatch = useDispatch();
	const history = useHistory();
	const {provider} = useParams();
	const query = useLocation().search;

	useEffect(() => {
		dispatch(providerLogin(provider, query, history));
	}, [provider, query, history, dispatch]);

	return <NotFound />;
}
