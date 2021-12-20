import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_COMPONENTS, PUBLISH_STATES} from 'types/story';
import {DEFAULT_LIMIT} from 'types/default';
import {REDUX_STATE} from 'types/redux';

import {selectStories, loadStories, deleteStory, selectDraftStory} from 'redux/draftStories';
import {selectUserId} from 'redux/auth';

import StoryList from './StoryList';

export default function DraftStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();

	const userId = useSelector(selectUserId);

	const handleDeleteStory = useCallback(
		storyId => {
			dispatch(deleteStory(storyId));
		},
		[dispatch]
	);

	return (
		<StoryList
			Component={Component}
			shouldLoadMore={shouldLoadMore}
			componentSelector={selectDraftStory}
			criteria={{
				...DEFAULT_LIMIT,
				_publicationState: PUBLISH_STATES.preview,
				published_at_null: true,
				archived_at_null: true,
				_sort: 'created_at:DESC',
				user: userId,
			}}
			reduxState={REDUX_STATE.draftStories}
			selector={selectStories}
			shouldTriggerLoad={!!userId}
			title="Drafts"
			onDeleteStory={handleDeleteStory}
			loadItems={loadStories}
		/>
	);
}

DraftStories.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
};

DraftStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
