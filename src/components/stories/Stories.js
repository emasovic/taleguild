import React, {useEffect, useState, memo, useCallback} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom';
import propTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import {DEFAULT_CRITERIA, STORY_OP} from 'types/story';

import {loadStories, selectStories} from '../../redux/story';
import {navigateToQuery} from 'redux/application';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import StoryItem from './StoryItem';

import './Stories.scss';

const CLASS = 'st-Stories';

const SORT = {
	recent: 'created_at',
	popular: 'likes_count',
};

function Stories({criteria, filter}) {
	const dispatch = useDispatch();
	const history = useHistory();
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
	const [storyCriteria, setStoryCriteria] = useState(null);
	const [activeSort, setActiveSort] = useState(SORT.recent);

	const categoryId = new URLSearchParams(useLocation().search).get('categories');
	const sortBy = new URLSearchParams(useLocation().search).get('_sort');

	const sortStories = sort => {
		setActiveSort(sort);
		dispatch(navigateToQuery({_sort: sort}, location, history));
	};

	const handleCount = useCallback(() => {
		const criteria = {...storyCriteria, _start: currentPage * 10};
		dispatch(loadStories(criteria, false, null, STORY_OP.load_more));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, storyCriteria]);

	useEffect(() => {
		if (criteria) {
			setStoryCriteria(criteria);
		}
	}, [criteria]);

	useEffect(() => {
		if (storyCriteria) {
			const _sort = sortBy && `${sortBy}:DESC`;
			dispatch(
				loadStories(
					{...storyCriteria, categories: categoryId, _sort},
					true,
					filter,
					undefined,
					true
				)
			);
		}
	}, [categoryId, sortBy, storyCriteria, dispatch, filter]);

	useEffect(() => {
		if (sortBy) {
			setActiveSort(sortBy);
		}
	}, [sortBy, storyCriteria]);

	const renderStories =
		stories && stories.length ? (
			orderBy(stories, [activeSort], ['desc']).map(item => {
				return (
					<StoryItem
						id={item.id}
						image={item.image}
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
					/>
				);
			})
		) : (
			<h2>No stories found</h2>
		);

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
			<div className={CLASS + '-lastest'}>
				{op === STORY_OP.loading ? <Loader /> : renderStories}
			</div>
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