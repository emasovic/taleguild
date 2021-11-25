import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
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
	const {data} = useSelector(selectAuthUser);
	const stories = useSelector(selectStories);
	const {loading} = useSelector(state => state.userStories);

	const userId = data?.id;

	useEffect(() => {
		if (userId) {
			dispatch(loadStories({...DEFAULT_CRITERIA, user: userId}));
		}
	}, [dispatch, userId]);

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
