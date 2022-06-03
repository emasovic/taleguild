import React, {useState} from 'react';

import {PRIVACY_POLICY} from 'lib/routes';

import {FONT_WEIGHT, TEXT_CURSORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {COLOR} from 'types/button';

import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import './CookiesPopup.scss';

const CLASS = 'st-CookiesPopup';

export default function CookiesPopup() {
	const [isAccepted, setIsAccepted] = useState(localStorage.getItem('termsAccepted'));

	const handleClick = () => {
		localStorage.setItem('termsAccepted', true);
		setIsAccepted(true);
	};
	const handleLinkClick = () => location.replace(PRIVACY_POLICY);

	if (isAccepted) return null;

	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-wrapper'}>
				<Typography component={TYPOGRAPHY_VARIANTS.p}>
					This website uses cookies to ensure you get the best experience on our website.
					<Typography
						onClick={handleLinkClick}
						fontWeight={FONT_WEIGHT.bold}
						cursor={TEXT_CURSORS.pointer}
						className={CLASS + '-wrapper-more'}
					>
						Learn more
					</Typography>
				</Typography>
				<IconButton onClick={handleClick} color={COLOR.secondary}>
					Got it
				</IconButton>
			</div>
		</MobileWrapper>
	);
}
