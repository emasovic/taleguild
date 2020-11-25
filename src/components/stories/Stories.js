import React, {useEffect, useState, memo, useCallback} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useLocation} from 'react-router-dom';
import propTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import {DEFAULT_CRITERIA, STORY_OP} from 'types/story';
import {MEDIA_SIZE} from 'types/media';

import {loadStories, selectStories} from '../../redux/story';
import {navigateToQuery} from 'redux/application';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import StoryItem from './StoryItem';
import NoStories from './NoStories';

import './Stories.scss';

const CLASS = 'st-Stories';

const SORT = {
	recent: 'created_at',
	popular: 'likes_count',
};

function Stories({criteria, filter}) {
	const dispatch = useDispatch();
	const location = useLocation();
	const {stories, op, pages} = useSelector(
		state => ({
			stories: selectStories(state),
			pages: state.stories.pages,
			op: state.stories.op,
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [activeSort, setActiveSort] = useState(SORT.recent);

	const categoryId = new URLSearchParams(useLocation().search).get('categories');
	const languageId = new URLSearchParams(useLocation().search).get('language');
	const sortBy = new URLSearchParams(useLocation().search).get('_sort');

	const sortStories = sort => {
		setActiveSort(sort);
		dispatch(navigateToQuery({_sort: sort}, location));
	};

	const handleCount = useCallback(() => {
		const loadMoreCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadStories(loadMoreCriteria, false, null, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, criteria]);

	useEffect(() => {
		if (criteria) {
			const _sort = sortBy ? `${sortBy}:DESC` : criteria._sort;
			dispatch(
				loadStories(
					{...criteria, categories: categoryId, language: languageId, _sort},
					true,
					filter,
					undefined,
					true
				)
			);
		}
	}, [categoryId, languageId, sortBy, criteria, dispatch, filter]);

	useEffect(() => {
		if (sortBy) {
			setActiveSort(sortBy);
		}
	}, [sortBy]);

	const renderStories =
		stories && stories.length ? (
			orderBy(stories, [activeSort], ['desc']).map(item => {
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
						createdDate={item.created_at}
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
			<Nav className={CLASS + '-header'}>
				<NavItem href="#" onClick={() => sortStories(SORT.recent, criteria)}>
					<NavLink active={activeSort === SORT.recent}>Recent stories</NavLink>
				</NavItem>
				<NavItem href="#" onClick={() => sortStories(SORT.popular)}>
					<NavLink active={activeSort === SORT.popular}>Popular stories</NavLink>
				</NavItem>
			</Nav>
			<div className={CLASS + '-lastest'}>{renderStories}</div>
		</LoadMore>
	);
}

Stories.propTypes = {
	criteria: propTypes.object,
	filter: propTypes.object,
};

Stories.defaultProps = {
	criteria: DEFAULT_CRITERIA,
};

const MemoizedStories = memo(Stories);

export default MemoizedStories;
