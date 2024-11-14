import React from 'react';
import {useSelector} from 'react-redux';

import {USER_STORIES_SAVED, goToUser, USER_STORIES_DRAFTS, USER_STORIES_ARCHIVED} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import {selectAuthUser} from 'redux/auth';

import MyStories from 'views/user/stories/MyStories';
import SavedStories from 'views/user/stories/SavedStories';
import DraftStories from 'views/user/stories/DraftStories';
import ArchivedStories from 'views/user/stories/ArchivedStories';

import DottedList from 'components/widgets/lists/dotted-list/DottedList';

import './StoryTabs.scss';

const CLASS = 'st-StoryTabs';

export default function StoryTabs() {
	const {data} = useSelector(selectAuthUser);

	const items = [
		{
			name: 'My stories',
			component: MyStories,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
				to: goToUser(data?.username),
			},
		},
		{
			name: 'Saved stories',
			component: SavedStories,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
				to: USER_STORIES_SAVED,
			},
		},
		{
			name: 'Drafts',
			component: DraftStories,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
				to: USER_STORIES_DRAFTS,
			},
		},
		{
			name: 'Archived stories',
			component: ArchivedStories,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
				to: USER_STORIES_ARCHIVED,
			},
		},
	];

	if (!data) {
		return null;
	}

	return <DottedList items={items} className={CLASS} initialActive={items[0]} />;
}
