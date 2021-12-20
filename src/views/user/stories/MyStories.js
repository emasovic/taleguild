import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_COMPONENTS} from 'types/story';
import {REDUX_STATE} from 'types/redux';

import {selectAuthUser} from 'redux/auth';
import {selectStories, loadStories, selectStory} from 'redux/userStories';

import StoryList from './StoryList';

export default function MyStories({Component}) {
	const {data} = useSelector(selectAuthUser);

	const userId = data?.id;

	return (
		<StoryList
			Component={Component}
			shouldLoadMore={false}
			componentSelector={selectStory}
			criteria={{
				...DEFAULT_CRITERIA,
				user: userId,
			}}
			reduxState={REDUX_STATE.userStories}
			selector={selectStories}
			shouldTriggerLoad={!!userId}
			title="My stories"
			loadItems={loadStories}
		/>
	);
}

MyStories.propTypes = {
	Component: PropTypes.any,
};

MyStories.defaultProps = {
	Component: STORY_COMPONENTS.list,
};
