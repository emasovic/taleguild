import React from 'react';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import DraftStories from '../stories/DraftStories';
import SavedStories from '../stories/SavedStories';

import StoriesPage from './StoriesPage';

export default function SavedStoriesPage() {
	return (
		<StoriesPage
			MainComponent={SavedStories}
			SideComponent={DraftStories}
			sideComponentProps={{
				to: USER_STORIES_DRAFTS,
			}}
		/>
	);
}
