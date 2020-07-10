import React from 'react';

import {HOME} from 'lib/routes';

import {TYPOGRAPHY_MERRI, TYPOGRAPHY_LATO} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';

import {ReactComponent as LogoShiled} from 'images/logo-shield.svg';

import './Welcome.scss';

const CLASS = 'st-Welcome';

export default function Welcome() {
	return (
		<div className={CLASS}>
			<LogoShiled />

			<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>Welcome to our guild.</span>
			<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
				We nurture free thought and creativity. In our guild, you can write stories that
				occupy your mind for a long time and share them with others. And others will help
				you shape those stories in a better light. For everything else you are free to
				contact us. Enjoy.
			</span>

			<IconButton href={HOME}>Open the door</IconButton>
		</div>
	);
}
