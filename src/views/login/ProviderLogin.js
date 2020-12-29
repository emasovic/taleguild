import React, {useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {HOME} from 'lib/routes';

import {USER_OP} from 'types/user';
import {ICONS} from 'types/icons';
import {TYPOGRAPHY_MERRI, TYPOGRAPHY_LATO} from 'types/typography';

import {providerLogin} from 'redux/user';

import Loader from 'components/widgets/loader/Loader';
import Icon from 'components/widgets/icon/Icon';
import IconButton from 'components/widgets/button/IconButton';

import './ProviderLogin.scss';

const CLASS = 'st-ProviderLogin';

export default function ProviderLogin() {
	const dispatch = useDispatch();
	const {provider} = useParams();
	const op = useSelector(state => state.user.op);
	const query = useLocation().search;

	useEffect(() => {
		dispatch(providerLogin(provider, query));
	}, [provider, query, dispatch]);

	if (op === USER_OP.provider_login) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<div className={CLASS + '-icon'}>
				<Icon icon={ICONS.logo_grey} />
			</div>

			<div className={CLASS + '-text'}>
				<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>
					This account already exists.
				</span>
				<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
					Account with this email address or username already exists.
				</span>
				<div className={CLASS + '-text-button'}>
					<IconButton href={HOME}>Back to guild</IconButton>
				</div>
			</div>
		</div>
	);
}
