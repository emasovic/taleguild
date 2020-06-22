import React from 'react';

import Categories from './stories/widgets/Categories';
import Stories from './stories/Stories';
import StoryTabs from './stories/StoryTabs';

import './Explore.scss';

const CLASS = 'st-Explore';

export default function Explore({criteria}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-main'}>
				<div className={CLASS + '-main-holder'}>
					<Categories />
				</div>

				<Stories criteria={criteria} />
				<StoryTabs />
			</div>
		</div>
	);
}
