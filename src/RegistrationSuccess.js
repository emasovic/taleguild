import React from 'react';

import {RESEND_CONFIRMATION_EMAIL} from 'lib/routes';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';

import {ReactComponent as LogoEmailShiled} from 'images/logo-shield-mail.svg';

import './RegistrationSuccess.scss';

const CLASS = 'st-RegistrationSuccess';

export default function RegistrationSuccess() {
	return (
		<PagePlaceholder
			className={CLASS}
			IconComponent={LogoEmailShiled}
			title="Thank You For Your Registration"
			subtitle="We have send you an confirmation email. Please confirm your email address to
				activate your account. If you don't see it, you may need to
				check your spam or junk folder."
			additional={
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
					In case you didn't receive email you can always resend it
				</Typography>
			}
			buttonLabel="Resend"
			to={RESEND_CONFIRMATION_EMAIL}
		/>
	);
}
