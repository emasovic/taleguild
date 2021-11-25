import React, {useEffect} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_COMPONENTS} from 'types/story';

import {selectAuthUser} from 'redux/auth';
import {selectStories, loadStories} from 'redux/userStories';

import Loader from 'components/widgets/loader/Loader';
import NoStories from 'views/stories/NoStories';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function MyStories({Component}) {
	const dispatch = useDispatch();
	const {stories, loading, loggedInUser} = useSelector(
		state => ({
			loggedInUser: selectAuthUser(state),
			stories: selectStories(state),
			pages: state.userStories.pages,
			loading: state.userStories.loading,
		}),
		shallowEqual
	);
	const {data} = loggedInUser;

	useEffect(() => {
		if (data) {
			dispatch(loadStories({...DEFAULT_CRITERIA, user: data.id}));
		}
	}, [dispatch, data]);

	const myStories =
		stories && stories.length ? (
			stories.map(item => {
				return (
					<Component
						id={item.id}
						image={item.image}
						title={item.title}
						description={item.description}
						key={item.id}
						categories={item.categories}
						likes={item.likes}
						comments={item.comments}
						storypages={item.storypages}
						author={item.user}
						createdDate={item.published_at}
						savedBy={item.saved_by}
						slug={item.slug}
					/>
				);
			})
		) : (
			<NoStories />
		);

	return (
		<div className={CLASS}>
			<span>MY STORIES</span>
			{loading ? <Loader /> : myStories}
		</div>
	);
}

MyStories.propTypes = {
	Component: PropTypes.any,
};

MyStories.defaultProps = {
	Component: STORY_COMPONENTS.list,
};
