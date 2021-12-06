import React from 'react';
import {Link} from 'react-router-dom';

import {DASHBOARD} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import {ReactComponent as Trees} from 'images/trees.svg';

import './NotFound.scss';

const CLASS = 'st-NotFound';

export default function NotFound() {
	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-trees'}>
				<Trees />
			</div>

			<div className={CLASS + '-error'}>
				<span>404</span>
				<Typography
					font={FONTS.merri}
					variant={TYPOGRAPHY_VARIANTS.h1}
					fontWeight={FONT_WEIGHT.bold}
				>
					You got lost in the woods.
				</Typography>
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
					Don’t worry, our wizard will tell you path where you can find what you are
					looking for.
				</Typography>
				<div className={CLASS + '-error-button'}>
					<IconButton tag={Link} to={DASHBOARD}>
						Back to guild
					</IconButton>
				</div>
			</div>
		</MobileWrapper>
	);
}
