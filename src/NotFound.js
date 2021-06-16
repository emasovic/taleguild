import React from 'react';

import {HOME} from 'lib/routes';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Trees} from 'images/trees.svg';

import './NotFound.scss';

const CLASS = 'st-NotFound';

export default function NotFound() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-trees'}>
				<Trees />
			</div>

			<div className={CLASS + '-error'}>
				<span>404</span>
				<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.h1}>
					You got lost in the woods.
				</Typography>
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
					Don’t worry, our wizard will tell you path where you can find what you are
					looking for.
				</Typography>
				<div className={CLASS + '-error-button'}>
					<IconButton href={HOME}>Back to guild</IconButton>
				</div>
			</div>
		</div>
	);
}
