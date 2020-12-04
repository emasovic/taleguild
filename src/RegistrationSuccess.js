import React from 'react';

import {LOGIN} from 'lib/routes';

import {TYPOGRAPHY_MERRI, TYPOGRAPHY_LATO} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';

import {ReactComponent as LogoEmailShiled} from 'images/logo-shield-mail.svg';

import './RegistrationSuccess.scss';

const CLASS = 'st-RegistrationSuccess';

export default function RegistrationSuccess() {
	return (
		<div className={CLASS}>
			<LogoEmailShiled />

			<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>
				Thank You For Your Registration
			</span>
			<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
				We have send you an confirmation email. Please confirm your email address to
				activate your account.
			</span>

			<IconButton href={LOGIN}>Go to Sign In</IconButton>
		</div>
	);
}
