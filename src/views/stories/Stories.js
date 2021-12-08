import React, {useEffect, useCallback, memo} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import queryString from 'query-string';
import {useLocation} from 'react-router-dom';
import propTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import {DEFAULT_CRITERIA, SORT_DIRECTION, STORY_OP, STORY_SORT} from 'types/story';
import {MEDIA_SIZE} from 'types/media';

import {loadStories, selectStories} from '../../redux/story';
import {navigateToQuery} from 'redux/application';

import {usePrevious} from 'hooks/compare';

import Loader from 'components/widgets/loader/Loader';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import SearchInput from 'components/search-input/SearchInput';

import StoryItem from './StoryItem';
import NoStories from './NoStories';

import './Stories.scss';

const CLASS = 'st-Stories';

const Stories = memo(({criteria, activeSort, displaySearch}) => {
	const dispatch = useDispatch();
	const location = useLocation();

	const stories = useSelector(state => selectStories(state, activeSort));
	const {pages, op, currentPage} = useSelector(state => state.stories);
	const previousCriteria = usePrevious(criteria);

	const shouldLoad = pages > currentPage && !op;

	const sortStories = sort =>
		dispatch(navigateToQuery({_sort: sort + ':' + SORT_DIRECTION.desc}, location));

	const handleCount = useCallback(() => {
		const loadMoreCriteria = {...criteria, _start: currentPage * 10};
		dispatch(loadStories(loadMoreCriteria, false, STORY_OP.load_more));
	}, [dispatch, currentPage, criteria]);

	useEffect(() => {
		if (criteria && !isEqual(criteria, previousCriteria)) {
			dispatch(loadStories(criteria, true));
		}
	}, [criteria, dispatch, previousCriteria]);

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
						views={item.views}
						comments={item.comments}
						storypages={item.storypages}
						author={item.user}
						createdDate={item.published_at}
						savedBy={item.saved_by}
						slug={item.slug}
						archivedAt={item.archived_at}
						displayArchived={!!item.published_at}
					/>
				);
			})
		) : (
			<NoStories />
		);

	return (
		<LoadMore
			id="stories"
			className={CLASS}
			onLoadMore={handleCount}
			shouldLoad={shouldLoad}
			loading={op === STORY_OP.load_more}
		>
			{nav}
			{displaySearch && (
				<SearchInput placeholder="Search stories" urlParamName="title_contains" />
			)}
			{op === STORY_OP.loading ? (
				<Loader />
			) : (
				<div className={CLASS + '-lastest'}>{renderStories}</div>
			)}
		</LoadMore>
	);
});

Stories.displayName = 'Stories';

Stories.propTypes = {
	criteria: propTypes.object,
	activeSort: propTypes.string,
	displaySearch: propTypes.bool,
};

Stories.defaultProps = {
	criteria: DEFAULT_CRITERIA,
	displaySearch: true,
};

const MemoizedStories = ({criteria, displaySearch}) => {
	const location = useLocation();
	const query = queryString.parse(location.search);

	const newCriteria = {...criteria, ...query};

	const activeSort = newCriteria._sort
		? newCriteria._sort.split(':')[0]
		: STORY_SORT.published_at;

	delete newCriteria.fbclid;
	delete newCriteria.ref;

	return <Stories criteria={newCriteria} activeSort={activeSort} displaySearch={displaySearch} />;
};

MemoizedStories.propTypes = {
	criteria: propTypes.object,
	displaySearch: propTypes.bool,
};

export default MemoizedStories;
