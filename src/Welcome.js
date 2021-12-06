import React from 'react';
import {Link} from 'react-router-dom';

import {DASHBOARD} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as LogoShiled} from 'images/logo-shield.svg';

import './Welcome.scss';

const CLASS = 'st-Welcome';

export default function Welcome() {
	return (
		<div className={CLASS}>
			<LogoShiled />

			<Typography
				font={FONTS.merri}
				variant={TYPOGRAPHY_VARIANTS.h1}
				fontWeight={FONT_WEIGHT.bold}
			>
				Welcome to our guild.
			</Typography>
			<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
				We nurture free thought and creativity. In our guild, you can write stories that
				occupy your mind for a long time and share them with others. And others will help
				you shape those stories in a better light. For everything else you are free to
				contact us. Enjoy.
			</Typography>

			<IconButton tag={Link} to={DASHBOARD}>
				Open the door
			</IconButton>
		</div>
	);
}
