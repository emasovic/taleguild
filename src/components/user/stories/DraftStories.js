import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_OP} from 'types/story';

import {selectStories, loadStories} from 'redux/draft_stories';
import {selectUser} from 'redux/user';

import StoryThumb from 'components/stories/StoryThumb';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './DraftStories.scss';

const CLASS = 'st-DraftStories';

export default function DraftStories({shoudLoadMore}) {
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
					<StoryThumb
						id={item.id}
						image={item.image}
						title={item.title}
						description={item.description}
						key={item.id}
						// author={item.user}
						createdDate={item.created_at}
					/>
				);
			})
		) : (
			<span>No stories found</span>
		);

	return (
		<LoadMore
			id="drafts"
			onLoadMore={handleCount}
			shouldLoad={pages > currentPage && shoudLoadMore}
			loading={op === STORY_OP.load_more}
			className={CLASS}
		>
			<span>Drafts</span>
			{op === STORY_OP.loading ? <Loader /> : stories}
		</LoadMore>
	);
}

DraftStories.propTypes = {
	shoudLoadMore: propTypes.bool,
};

DraftStories.defaultProps = {
	shoudLoadMore: true,
};
