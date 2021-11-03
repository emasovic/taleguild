import React from 'react';

import {USER_STORIES_ARCHIVED} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import Link, {UNDERLINE} from 'components/widgets/link/Link';

import DraftStories from '../stories/DraftStories';
import ArchivedStories from '../stories/ArchivedStories';

import './DraftStoriesPage.scss';

const CLASS = 'st-DraftStoriesPage';

export default function DraftStoriesPage() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-saved'}>
				<ArchivedStories shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link to={USER_STORIES_ARCHIVED} UNDERLINE={UNDERLINE.hover}>
					View all
				</Link>
			</div>
			<DraftStories />

			<div className={CLASS + '-holder'} />
		</div>
	);
}
