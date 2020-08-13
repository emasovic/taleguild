import React from 'react';

import {HOME} from 'lib/routes';

import {TYPOGRAPHY_MERRI, TYPOGRAPHY_LATO} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';

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
				<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>You got lost in the woods.</span>
				<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
					Don’t worry, our wizard will tell you path where you can find what you are
					looking for.
				</span>
				<div className={CLASS + '-error-button'}>
					<IconButton href={HOME}>Back to guild</IconButton>
				</div>
			</div>
		</div>
	);
}
