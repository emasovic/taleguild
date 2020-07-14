import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_OP, STORY_COMPONENTS} from 'types/story';

import {selectStories, loadStories, deleteStory} from 'redux/draft_stories';
import {selectUser} from 'redux/user';

import NoStories from 'components/stories/NoStories';
import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './DraftStories.scss';

const CLASS = 'st-DraftStories';

export default function DraftStories({shouldLoadMore, Component}) {
	const dispatch = useDispatch();
	const {drafts, user, pages, op} = useSelector(
		state => ({
			drafts: selectStories(state),
			op: state.drafts.op,
			pages: state.drafts.pages,
			user: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = user;

	const [currentPage, setCurrentPage] = useState(1);
	const [criteria, setCriteria] = useState();

	const handleCount = useCallback(() => {
		const storyCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadStories(storyCriteria, false, null, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	const handleDeleteStory = useCallback(
		storyId => {
			dispatch(deleteStory(storyId));
		},
		[dispatch]
	);

	useEffect(() => {
		if (data) {
			setCriteria({...DEFAULT_CRITERIA, published: false, user: data.id});
		}
	}, [data]);

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
