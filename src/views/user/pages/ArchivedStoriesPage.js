import React from 'react';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import Link, {UNDERLINE} from 'components/widgets/link/Link';

import DraftStories from '../stories/DraftStories';
import ArchivedStories from '../stories/ArchivedStories';

import './ArchivedStoriesPage.scss';

const CLASS = 'st-ArchivedStoriesPage';

export default function ArchivedStoriesPage() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-drafts'}>
				<DraftStories shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link to={USER_STORIES_DRAFTS} underline={UNDERLINE.hover}>
					View all
				</Link>
			</div>

			<ArchivedStories />
			<div className={CLASS + '-holder'} />
		</div>
	);
}
