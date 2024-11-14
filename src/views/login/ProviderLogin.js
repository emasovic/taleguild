import React, {useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {DASHBOARD} from 'lib/routes';

import {USER_OP} from 'types/user';
import {ICONS} from 'types/icons';

import {providerLogin} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';
import Icon from 'components/widgets/icon/Icon';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';

import './ProviderLogin.scss';

const CLASS = 'st-ProviderLogin';

export default function ProviderLogin() {
	const dispatch = useDispatch();
	const {provider} = useParams();
	const op = useSelector(state => state.auth.op);
	const query = useLocation().search;

	useEffect(() => {
		dispatch(providerLogin(provider, query));
	}, [provider, query, dispatch]);

	if (op[USER_OP.provider_login].loading) return <Loader />;

	return (
		<PagePlaceholder
			className={CLASS + '-placeholder'}
			IconComponent={Icon}
			iconComponentProps={{icon: ICONS.logo_grey, size: 100}}
			title="This account already exists."
			subtitle="Account with this email address or username already exists."
			to={DASHBOARD}
			buttonLabel="Back to guild"
		/>
	);
}
