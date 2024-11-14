import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {goToWidget} from 'lib/routes';

import {REDUX_STATE} from 'types/redux';
import {DEFAULT_CRITERIA, STORY_COMPONENTS} from 'types/story';
import {COLOR} from 'types/button';

import {
	selectUserSavedStories,
	loadSavedStories,
	createOrDeleteSavedStory,
	selectUserSavedStory,
} from 'redux/savedStories';
import {selectUserId} from 'redux/auth';

import Link from 'components/widgets/link/Link';

import NoItemsPlaceholder from 'views/dashboard/widgets/NoItemsPlaceholder';
import {WIDGETS} from 'views/community/Community';

import StoryList from './StoryList';

export default function SavedStories({shouldLoadMore, Component, to}) {
	const dispatch = useDispatch();

	const userId = useSelector(selectUserId);

	const handleDeleteStory = useCallback(
		favouriteId => {
			dispatch(createOrDeleteSavedStory({id: favouriteId}, null));
		},
		[dispatch]
	);

	return (
		<StoryList
			Component={Component}
			shouldLoadMore={shouldLoadMore}
			componentSelector={selectUserSavedStory}
			criteria={{
				...DEFAULT_CRITERIA,
				filters: {
					...DEFAULT_CRITERIA.filters,
					user: userId,
					archived_at: undefined,
				},
				publicationState: undefined,
				sort: ['createdAt:DESC'],
			}}
			NoItemsComponent={NoItemsPlaceholder}
			noItemsComponentProps={{
				title: 'Explore stories in Community',
				subtitle:
					'Find stories you like from other writers and save them here so you can always access and read them.',
				buttonText: 'Visit our community',
				buttonProps: {color: COLOR.secondary, tag: Link, to: goToWidget(WIDGETS.explore)},
			}}
			onDeleteStory={handleDeleteStory}
			reduxState={REDUX_STATE.savedStories}
			selector={selectUserSavedStories}
			shouldTriggerLoad={!!userId}
			title="Saved stories"
			loadItems={loadSavedStories}
			to={to}
		/>
	);
}

SavedStories.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
	to: propTypes.string,
};

SavedStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
