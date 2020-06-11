import StoryThumb from 'components/stories/StoryThumb';
import StoryItem from 'components/stories/StoryItem';

export const DEFAULT_CRITERIA = {_start: 0, _limit: 10, _sort: 'created_at:DESC', published: true};

export const DEFAULT_STORYPAGE_DATA = [{type: 'paragraph', children: [{text: ''}]}];

export const STORY_COMPONENTS = {
	thumb: StoryThumb,
	item: StoryItem,
};
