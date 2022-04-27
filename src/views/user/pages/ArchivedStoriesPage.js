import React from 'react';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import {PROJECT_TYPES} from 'types/project';

import {useGetSearchParams} from 'hooks/getSearchParams';

import DraftStories from '../stories/DraftStories';
import ArchivedStories from '../stories/ArchivedStories';

import StoriesPage from './StoriesPage';

export default function ArchivedStoriesPage() {
	const {project} = useGetSearchParams();
	return (
		<StoriesPage
			MainComponent={ArchivedStories}
			mainComponentProps={{criteria: {project, project_null: project ? undefined : true}}}
			SideComponent={DraftStories}
			sideComponentProps={{
				to: USER_STORIES_DRAFTS,
			}}
			projectType={PROJECT_TYPES.archived_story}
		/>
	);
}
