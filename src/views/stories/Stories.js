import React, {useEffect, useState, useCallback} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import queryString from 'query-string';
import {useLocation} from 'react-router-dom';
import propTypes from 'prop-types';

import {DEFAULT_CRITERIA, SORT_DIRECTION, STORY_OP, STORY_SORT} from 'types/story';
import {MEDIA_SIZE} from 'types/media';

import {loadStories, selectStories} from '../../redux/story';
import {navigateToQuery} from 'redux/application';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import StoryItem from './StoryItem';
import NoStories from './NoStories';

import './Stories.scss';

const CLASS = 'st-Stories';
function Stories({criteria, activeSort}) {
	const dispatch = useDispatch();
	const location = useLocation();

	const {stories, op, pages} = useSelector(
		state => ({
			stories: selectStories(state, activeSort),
			pages: state.stories.pages,
			op: state.stories.op,
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);

	const sortStories = sort =>
		dispatch(navigateToQuery({_sort: sort + ':' + SORT_DIRECTION.desc}, location));

	const handleCount = useCallback(() => {
		const loadMoreCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadStories(loadMoreCriteria, false, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria, true));
		}
	}, [criteria, dispatch]);

	const nav = (
		<Nav className={CLASS + '-header'}>
			<NavItem href="#" onClick={() => sortStories(STORY_SORT.published_at)}>
				<NavLink active={activeSort.includes(STORY_SORT.published_at)}>
					Recent stories
				</NavLink>
			</NavItem>
			<NavItem href="#" onClick={() => sortStories(STORY_SORT.likes_count)}>
				<NavLink active={activeSort.includes(STORY_SORT.likes_count)}>
					Popular stories
				</NavLink>
			</NavItem>
		</Nav>
	);

	const renderStories =
		stories && stories.length ? (
			stories.map(item => {
				return (
					<StoryItem
						id={item.id}
						image={item.image}
						size={MEDIA_SIZE.small}
						formats={item.image && item.image.formats}
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

	if (op === STORY_OP.loading) {
		return (
			<div className={CLASS}>
				{nav}
				<Loader />
			</div>
		);
	}

	return (
		<LoadMore
			id="stories"
			className={CLASS}
			onLoadMore={handleCount}
			shouldLoad={pages > currentPage}
			loading={op === STORY_OP.load_more}
		>
			{nav}
			<div className={CLASS + '-lastest'}>{renderStories}</div>
		</LoadMore>
	);
}

Stories.propTypes = {
	criteria: propTypes.object,
};

Stories.defaultProps = {
	criteria: DEFAULT_CRITERIA,
};

const MemoizedStories = ({criteria}) => {
	const location = useLocation();
	const query = queryString.parse(location.search);

	const newCriteria = {...criteria, ...query};

	const activeSort = newCriteria._sort
		? newCriteria._sort.split(':')[0]
		: STORY_SORT.published_at;

	delete newCriteria.fbclid;

	return <Stories criteria={newCriteria} activeSort={activeSort} />;
};

export default MemoizedStories;
