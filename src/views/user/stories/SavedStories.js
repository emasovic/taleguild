import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {goToWidget} from 'lib/routes';

import {DEFAULT_CRITERIA, STORY_OP, STORY_COMPONENTS} from 'types/story';
import {DEFAULT_LIMIT} from 'types/default';
import {COLOR} from 'types/button';

import {
	selectUserSavedStories,
	loadSavedStories,
	createOrDeleteSavedStory,
	selectUserSavedStory,
} from 'redux/savedStories';
import {selectUserId} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import NoItemsPlaceholder from 'views/dashboard/widgets/NoItemsPlaceholder';
import Link from 'components/widgets/link/Link';

import {WIDGETS} from 'views/community/Community';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function SavedStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const savedStories = useSelector(selectUserSavedStories);
	const userId = useSelector(selectUserId);
	const pages = useSelector(state => state.savedStories.pages);
	const op = useSelector(state => state.savedStories.op);

	const [currentPage, setCurrentPage] = useState(1);
	const [criteria, setCriteria] = useState();

	const handleCount = useCallback(() => {
		const storyCriteria = {...criteria, _start: currentPage * DEFAULT_LIMIT._limit};
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
		if (userId) {
			setCriteria({
				...DEFAULT_CRITERIA,
				archived_at_null: undefined,
				_publicationState: undefined,
				_sort: 'created_at:DESC',
				user: userId,
			});
		}
	}, [userId]);

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
						id={item.id}
						image={story.image}
						formats={item.image && item.image.formats}
						title={story.title}
						description={story.description}
						key={item.id}
						author={story.user}
						createdDate={story.published_at}
						slug={story.slug}
						onDeleteStory={id => handleDeleteStory(id, item.id)}
						selector={selectUserSavedStory}
					/>
				);
			})
		) : (
			<NoItemsPlaceholder
				title="Explore stories in Community"
				subtitle="Find stories you like from other writers and save them here so you can always access and read them."
				buttonText="Visit our community"
				buttonProps={{color: COLOR.secondary, tag: Link, to: goToWidget(WIDGETS.explore)}}
			/>
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
	Component: propTypes.any,
};

SavedStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
