import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_COMPONENTS, PUBLISH_STATES} from 'types/story';
import {DEFAULT_PAGINATION} from 'types/default';
import {REDUX_STATE} from 'types/redux';

import {selectStories, loadStories, deleteStory, selectDraftStory} from 'redux/draftStories';
import {selectUserId} from 'redux/auth';

import StoryList from './StoryList';

export default function DraftStories({shouldLoadMore, Component, to}) {
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
				pagination: DEFAULT_PAGINATION,
				publicationState: PUBLISH_STATES.preview,
				filters: {
					published_at: {
						$null: true,
					},
					archived_at: {
						$null: true,
					},
					user: userId,
				},
				sort: ['createdAt:DESC'],
			}}
			reduxState={REDUX_STATE.draftStories}
			selector={selectStories}
			shouldTriggerLoad={!!userId}
			title="Drafts"
			onDeleteStory={handleDeleteStory}
			loadItems={loadStories}
			to={to}
		/>
	);
}

DraftStories.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
	to: propTypes.string,
};

DraftStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
