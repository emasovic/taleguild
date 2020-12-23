import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_OP, STORY_COMPONENTS} from 'types/story';

import {selectStories, loadStories, deleteStory} from 'redux/draft_stories';
import {loggedUserId} from 'redux/user';

import NoStories from 'components/stories/NoStories';
import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './DraftStories.scss';

const CLASS = 'st-DraftStories';

export default function DraftStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const {drafts, userId, pages, op} = useSelector(
		state => ({
			drafts: selectStories(state),
			op: state.draft_stories.op,
			pages: state.draft_stories.pages,
			userId: loggedUserId(state),
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [criteria, setCriteria] = useState();

	const handleCount = useCallback(() => {
		const storyCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadStories(storyCriteria, false, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	const handleDeleteStory = useCallback(
		storyId => {
			dispatch(deleteStory(storyId));
		},
		[dispatch]
	);

	useEffect(() => {
		if (userId) {
			setCriteria({...DEFAULT_CRITERIA, published: false, user: userId});
		}
	}, [userId]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria, true));
		}
	}, [dispatch, criteria]);

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
						createdDate={item.created_at}
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
			shouldLoad={pages > currentPage && shouldLoadMore}
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
};

DraftStories.defaultProps = {
	shouldLoadMore: true,
	Component: STORY_COMPONENTS.thumb,
};
