import React from 'react';

import {USER_STORIES_ARCHIVED} from 'lib/routes';

import {TEXT_TRASFORM} from 'types/typography';

import RecentWork from 'views/dashboard/widgets/RecentWork';
import ArchivedStories from '../stories/ArchivedStories';

import StoriesPage from './StoriesPage';

export default function DraftStoriesPage() {
	return (
		<StoriesPage
			MainComponent={RecentWork}
			mainComponentProps={{
				shouldLoadMore: true,
				title: 'Drafts',
				titleProps: {textTransform: TEXT_TRASFORM.uppercase},
				placeholderProps: {
					subtitle:
						'Start writing your first story with our simple and clean text editor',
					buttonText: 'Write story now',
				},
			}}
			SideComponent={ArchivedStories}
			sideComponentProps={{
				to: USER_STORIES_ARCHIVED,
			}}
		/>
	);
}
