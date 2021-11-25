import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_OP, STORY_COMPONENTS, PUBLISH_STATES} from 'types/story';
import {DEFAULT_LIMIT} from 'types/default';

import {selectStories, loadStories, deleteStory} from 'redux/draftStories';
import {selectUserId} from 'redux/auth';

import NoStories from 'views/stories/NoStories';
import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function DraftStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const drafts = useSelector(selectStories);
	const {op, currentPage, pages} = useSelector(state => state.draftStories);
	const userId = useSelector(selectUserId);

	const shouldLoad = pages > currentPage && shouldLoadMore && !op;

	const handleCount = useCallback(() => {
		const storyCriteria = {
			...DEFAULT_LIMIT,
			_publicationState: PUBLISH_STATES.preview,
			published_at_null: true,
			archived_at_null: true,
			user: userId,
			_sort: 'created_at:DESC',
			_start: currentPage * 10,
		};
		dispatch(loadStories(storyCriteria, false, STORY_OP.load_more));
	}, [dispatch, currentPage, userId]);

	const handleDeleteStory = useCallback(
		storyId => {
			dispatch(deleteStory(storyId));
		},
		[dispatch]
	);

	useEffect(() => {
		if (userId) {
			dispatch(
				loadStories(
					{
						...DEFAULT_LIMIT,
						_publicationState: PUBLISH_STATES.preview,
						published_at_null: true,
						archived_at_null: true,
						user: userId,
						_sort: 'created_at:DESC',
					},
					true
				)
			);
		}
	}, [dispatch, userId]);

	const stories =
		drafts && drafts.length ? (
			drafts.map(item => {
				return (
					<Component
						id={item.id}
						image={item.image}
						formats={item.image && item.image.formats}
						title={item.title || 'Untitled'}
						description={item.description}
						key={item.id}
						onDeleteStory={handleDeleteStory}
						createdDate={item.published_at}
						storypages={item.storypages}
						slug={item.slug}
						// author={item.user}
					/>
				);
			})
		) : (
			<NoStories />
		);

	return (
		<LoadMore
			id="drafts"
			onLoadMore={handleCount}
			shouldLoad={shouldLoad}
			loading={op === STORY_OP.load_more}
			className={CLASS}
		>
			<span>Drafts</span>
			{op === STORY_OP.loading ? <Loader /> : stories}
		</LoadMore>
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
