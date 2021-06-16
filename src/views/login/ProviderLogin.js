import React, {useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {HOME} from 'lib/routes';

import {USER_OP} from 'types/user';
import {ICONS} from 'types/icons';
import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {providerLogin} from 'redux/user';

import Loader from 'components/widgets/loader/Loader';
import Icon from 'components/widgets/icon/Icon';
import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

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
				<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.h1}>
					This account already exists.
				</Typography>
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
					Account with this email address or username already exists.
				</Typography>
				<div className={CLASS + '-text-button'}>
					<IconButton href={HOME}>Back to guild</IconButton>
				</div>
			</div>
		</div>
	);
}
