import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_OP, STORY_COMPONENTS} from 'types/story';

import {
	selectArchivedStories,
	loadArchivedStories,
	removeArchivedStory,
} from 'redux/archivedStories';
import {selectUserId} from 'redux/user';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import NoStories from 'views/stories/NoStories';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function ArchivedStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const archivedStories = useSelector(selectArchivedStories);
	const userId = useSelector(selectUserId);
	const pages = useSelector(state => state.archivedStories.pages);
	const op = useSelector(state => state.archivedStories.op);

	const [currentPage, setCurrentPage] = useState(1);

	const criteria = useMemo(
		() => ({
			...DEFAULT_CRITERIA,
			_publicationState: undefined,
			_sort: 'published_at:DESC',
			archived_at_null: false,
			user: userId,
		}),
		[userId]
	);

	const handleCount = useCallback(() => {
		const storyCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadArchivedStories(storyCriteria, false, null, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	const handleDeleteStory = useCallback(
		id => {
			dispatch(removeArchivedStory(id));
		},
		[dispatch]
	);

	useEffect(() => {
		if (userId) {
			dispatch(loadArchivedStories(criteria, true));
		}
	}, [dispatch, criteria, userId]);

	const stories = archivedStories?.length ? (
		archivedStories.map(item => {
			return (
				<Component
					id={item.id}
					favouriteId={item.id}
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
					displayArchived
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
			shouldLoad={pages > currentPage && shouldLoadMore}
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
