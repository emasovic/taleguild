import React from 'react';

import {TYPOGRAPHY_MERRI} from 'types/typography';

import {ReactComponent as EmptyState} from 'images/no-story-scroll.svg';

import './NoStories.scss';

const CLASS = 'st-NoStories';

export default function NoStories() {
	return (
		<div className={CLASS}>
			<EmptyState />
			<span className={TYPOGRAPHY_MERRI.heading_h2_black_bold}>
				There are no stories here yet.
			</span>
		</div>
	);
}
