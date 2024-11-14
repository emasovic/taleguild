import React from 'react';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import DraftStories from '../stories/DraftStories';
import ArchivedStories from '../stories/ArchivedStories';

import StoriesPage from './StoriesPage';

export default function ArchivedStoriesPage() {
	return (
		<StoriesPage
			MainComponent={ArchivedStories}
			SideComponent={DraftStories}
			sideComponentProps={{
				to: USER_STORIES_DRAFTS,
			}}
		/>
	);
}
