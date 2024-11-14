import StoryThumb from 'views/stories/StoryThumb';
import StoryItem from 'views/stories/StoryItem';
import StoryListItem from 'views/stories/StoryListItem';

import {DEFAULT_PAGINATION} from './default';

export const PUBLISH_STATES = {
	live: 'live',
	preview: 'preview',
};

export const DEFAULT_CRITERIA = {
	pagination: DEFAULT_PAGINATION,
	sort: ['publishedAt:desc'],
	publicationState: PUBLISH_STATES.live,
	filters: {
		archived_at: {
			$null: true,
		},
	},
};

export const DEFAULT_STORYPAGE_DATA = [{type: 'paragraph', children: [{text: ''}]}];

export const STORY_COMPONENTS = {
	item: StoryItem,
	thumb: StoryThumb,
	list: StoryListItem,
};

export const STORY_OP = {
	loading: 'loading',
	load_more: 'load_more',
	saving_comment: 'saving_comment',
	saving_like: 'saving_like',
	saving_saved: 'saving_saved',
	saving_storypage: 'saving_storypage',
	deleting_comment: 'deleting_comment',
	deleting_like: 'deleting_like',
	deleting_saved: 'deleting_saved',
	deleting_storypage: 'deleting_storypage',
};

export const STORY_SORT = {
	likes_count: 'likes_count',
	publishedAt: 'publishedAt',
	createdAt: 'createdAt',
};

export const SORT_DIRECTION = {
	asc: 'asc',
	desc: 'desc',
};

export const getIdFromSlug = slug => {
	const splited = slug.split('-');
	const id = splited[splited.length - 1];

	return id;
};
