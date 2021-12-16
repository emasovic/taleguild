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
			to: goToUser(data.username),
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
			},
		},
		{
			name: 'Saved stories',
			component: SavedStories,
			to: USER_STORIES_SAVED,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
			},
		},
		{
			name: 'Drafts',
			component: DraftStories,
			to: USER_STORIES_DRAFTS,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
			},
		},
		{
			name: 'Archived stories',
			component: ArchivedStories,
			to: USER_STORIES_ARCHIVED,
			componentProps: {
				shouldLoadMore: false,
				Component: STORY_COMPONENTS.list,
			},
		},
	];

	if (!data) {
		return null;
	}

	return <DottedList items={items} className={CLASS} initialActive={items[0]} />;
}
