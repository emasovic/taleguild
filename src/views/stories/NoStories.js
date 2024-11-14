import React from 'react';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {ReactComponent as EmptyState} from 'images/no-story-scroll.svg';

import Typography from 'components/widgets/typography/Typography';

import './NoStories.scss';

const CLASS = 'st-NoStories';

export default function NoStories() {
	return (
		<div className={CLASS}>
			<EmptyState />
			<Typography
				font={FONTS.merri}
				variant={TYPOGRAPHY_VARIANTS.h2}
				fontWeight={FONT_WEIGHT.bold}
			>
				There are no stories here yet.
			</Typography>
		</div>
	);
}
