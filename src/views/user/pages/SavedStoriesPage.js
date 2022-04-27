import React from 'react';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import {PROJECT_TYPES} from 'types/project';

import {useGetSearchParams} from 'hooks/getSearchParams';

import DraftStories from '../stories/DraftStories';
import SavedStories from '../stories/SavedStories';

import StoriesPage from './StoriesPage';

export default function SavedStoriesPage() {
	const {project} = useGetSearchParams();
	return (
		<StoriesPage
			MainComponent={SavedStories}
			mainComponentProps={{criteria: {project, project_null: project ? undefined : true}}}
			SideComponent={DraftStories}
			sideComponentProps={{
				to: USER_STORIES_DRAFTS,
			}}
			projectType={PROJECT_TYPES.saved_story}
		/>
	);
}
