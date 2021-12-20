import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_COMPONENTS} from 'types/story';
import {DEFAULT_LIMIT} from 'types/default';
import {REDUX_STATE} from 'types/redux';

import {
	selectArchivedStories,
	loadArchivedStories,
	removeArchivedStory,
	selectArchivedStory,
} from 'redux/archivedStories';
import {selectUserId} from 'redux/auth';

import StoryList from './StoryList';

export default function ArchivedStories({shouldLoadMore, Component, to}) {
	const dispatch = useDispatch();

	const userId = useSelector(selectUserId);

	const handleDeleteStory = useCallback(id => dispatch(removeArchivedStory(id)), [dispatch]);

	return (
		<StoryList
			Component={Component}
			shouldLoadMore={shouldLoadMore}
			componentSelector={selectArchivedStory}
			criteria={{
				...DEFAULT_LIMIT,
				_sort: 'published_at:DESC',
				archived_at_null: false,
				user: userId,
			}}
			reduxState={REDUX_STATE.archivedStories}
			selector={selectArchivedStories}
			shouldTriggerLoad={!!userId}
			title="Archived stories"
			onDeleteStory={handleDeleteStory}
			loadItems={loadArchivedStories}
			to={to}
		/>
	);
}

ArchivedStories.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
	to: propTypes.string,
};

ArchivedStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
