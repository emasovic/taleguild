import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_OP, STORY_COMPONENTS} from 'types/story';
import {DEFAULT_LIMIT} from 'types/default';

import {
	selectArchivedStories,
	loadArchivedStories,
	removeArchivedStory,
	selectArchivedStory,
} from 'redux/archivedStories';
import {selectUserId} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import NoStories from 'views/stories/NoStories';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function ArchivedStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const archivedStories = useSelector(selectArchivedStories);
	const userId = useSelector(selectUserId);
	const {pages, op, currentPage} = useSelector(state => state.archivedStories);

	const shouldLoad = pages > currentPage && shouldLoadMore && !op;

	const handleCount = useCallback(() => {
		const storyCriteria = {
			_sort: 'published_at:DESC',
			archived_at_null: false,
			user: userId,
			...DEFAULT_LIMIT,
			_start: currentPage * DEFAULT_LIMIT._limit,
		};
		dispatch(loadArchivedStories(storyCriteria, false, null, STORY_OP.load_more));
	}, [dispatch, currentPage, userId]);

	const handleDeleteStory = useCallback(
		id => {
			dispatch(removeArchivedStory(id));
		},
		[dispatch]
	);

	useEffect(() => {
		if (userId) {
			dispatch(
				loadArchivedStories(
					{
						...DEFAULT_LIMIT,
						_sort: 'published_at:DESC',
						archived_at_null: false,
						user: userId,
					},
					true
				)
			);
		}
	}, [dispatch, userId]);

	const stories = archivedStories?.length ? (
		archivedStories.map(item => {
			return (
				<Component
					id={item.id}
					image={item.image}
					formats={item.image && item.image.formats}
					title={item.title}
					description={item.description}
					key={item.id}
					author={item.user}
					createdDate={item.published_at}
					archivedAt={item.archived_at}
					slug={item.slug}
					storypages={item.storypages}
					onDeleteStory={handleDeleteStory}
					selector={selectArchivedStory}
				/>
			);
		})
	) : (
		<NoStories />
	);

	return (
		<LoadMore
			id="archived"
			onLoadMore={handleCount}
			shouldLoad={shouldLoad}
			loading={op === STORY_OP.load_more}
			className={CLASS}
		>
			<span>Archived stories</span>
			{op === STORY_OP.loading ? <Loader /> : stories}
		</LoadMore>
	);
}

ArchivedStories.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
};

ArchivedStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
