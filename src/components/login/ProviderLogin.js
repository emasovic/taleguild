import React, {useEffect} from 'react';
import {useLocation, useParams, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {USER_OP} from 'types/user';

import {providerLogin} from 'redux/user';

import NotFound from 'NotFound';

import Loader from 'components/widgets/loader/Loader';

export default function ProviderLogin() {
	const dispatch = useDispatch();
	const history = useHistory();
	const {provider} = useParams();
	const op = useSelector(state => state.user.op);
	const query = useLocation().search;

	useEffect(() => {
		dispatch(providerLogin(provider, query, history));
	}, [provider, query, history, dispatch]);

	if (op === USER_OP.provider_login) {
		return <Loader />;
	}

	return <NotFound />;
}
