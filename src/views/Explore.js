import React from 'react';

import {DEFAULT_CRITERIA} from 'types/story';

import SideBar from 'views/stories/SideBar';

import Stories from 'views/stories/Stories';
import StoryTabs from 'views/stories/StoryTabs';

import './Explore.scss';

const CLASS = 'st-Explore';

export default function Explore({criteria}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-main'}>
				<div className={CLASS + '-main-holder'}>
					<SideBar />
				</div>

				<Stories criteria={criteria} />
				<div className={CLASS + '-main-holder'}>
					<StoryTabs />
				</div>
			</div>
		</div>
	);
}

Explore.defaultProps = {
	criteria: DEFAULT_CRITERIA,
};
