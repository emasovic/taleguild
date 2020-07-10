import StoryThumb from 'components/stories/StoryThumb';
import StoryItem from 'components/stories/StoryItem';
import StoryListItem from 'components/stories/StoryListItem';

export const DEFAULT_CRITERIA = {_start: 0, _limit: 10, _sort: 'created_at:DESC', published: true};

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
