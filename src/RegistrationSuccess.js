import React from 'react';
import {Link} from 'react-router-dom';

import {LOGIN} from 'lib/routes';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as LogoEmailShiled} from 'images/logo-shield-mail.svg';

import './RegistrationSuccess.scss';

const CLASS = 'st-RegistrationSuccess';

export default function RegistrationSuccess() {
	return (
		<div className={CLASS}>
			<LogoEmailShiled />

			<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.h1}>
				Thank You For Your Registration
			</Typography>
			<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
				We have send you an confirmation email. Please confirm your email address to
				activate your account.
			</Typography>
			<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
				If you don't see it, you may need to <b>check your spam or junk folder.</b>
			</Typography>

			<IconButton tag={Link} to={LOGIN}>
				Go to Sign In
			</IconButton>
		</div>
	);
}
