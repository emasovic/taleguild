import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_OP, STORY_COMPONENTS} from 'types/story';

import {
	selectUserSavedStories,
	loadSavedStories,
	createOrDeleteSavedStory,
} from 'redux/saved_stories';
import {selectUser} from 'redux/user';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './SavedStories.scss';

const CLASS = 'st-SavedStories';

export default function SavedStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const {savedStories, user, pages, op} = useSelector(
		state => ({
			savedStories: selectUserSavedStories(state),
			op: state.saved_stories.op,
			pages: state.saved_stories.pages,
			user: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = user;

	const [currentPage, setCurrentPage] = useState(1);
	const [criteria, setCriteria] = useState();

	const handleCount = useCallback(() => {
		const storyCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadSavedStories(storyCriteria, false, null, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	const handleDeleteStory = useCallback(
		(storyId, favouriteId) => {
			dispatch(createOrDeleteSavedStory({id: favouriteId}, null, storyId));
		},
		[dispatch]
	);

	useEffect(() => {
		if (data) {
			setCriteria({...DEFAULT_CRITERIA, published: undefined, user: data.id});
		}
	}, [data]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadSavedStories(criteria, true));
		}
	}, [dispatch, criteria]);

	const stories =
		savedStories && savedStories.length ? (
			savedStories.map(item => {
				const {story} = item;
				if (!story) {
					return null;
				}

				return (
					<Component
						id={story.id}
						favouriteId={item.id}
						image={story.image}
						formats={item.image && item.image.formats}
						title={story.title}
						description={story.description}
						key={item.id}
						author={story.user}
						createdDate={story.created_at}
						onDeleteStory={handleDeleteStory}
					/>
				);
			})
		) : (
			<span>No stories found</span>
		);

	return (
		<LoadMore
			id="saved"
			onLoadMore={handleCount}
			shouldLoad={pages > currentPage && shouldLoadMore}
			loading={op === STORY_OP.load_more}
			className={CLASS}
		>
			<span>Saved stories</span>
			{op === STORY_OP.loading ? <Loader /> : stories}
		</LoadMore>
	);
}

SavedStories.propTypes = {
	shouldLoadMore: propTypes.bool,
};

SavedStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
