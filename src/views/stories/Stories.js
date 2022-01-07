import React, {useEffect, useCallback, memo} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import propTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import {DEFAULT_CRITERIA, SORT_DIRECTION, STORY_OP, STORY_SORT} from 'types/story';
import {MEDIA_SIZE} from 'types/media';

import {loadStories, selectStories} from '../../redux/story';
import {navigateToQuery} from 'redux/application';

import {useGetSearchParams} from 'hooks/getSearchParams';
import {usePrevious} from 'hooks/compare';

import LoadMore from 'components/widgets/loadmore/LoadMore';
import SearchInput from 'components/widgets/search-input/SearchInput';

import StoryItem from './StoryItem';
import NoStories from './NoStories';

import './Stories.scss';

const CLASS = 'st-Stories';

const Stories = memo(
	({
		criteria,
		activeSort,
		NoItemsComponent,
		noItemsComponentProps,
		displayNav,
		displaySearch,
	}) => {
		const dispatch = useDispatch();
		const {title_contains} = useGetSearchParams();

		const stories = useSelector(state => selectStories(state, activeSort));
		const {op, total} = useSelector(state => state.stories);

		const prevCriteria = usePrevious(criteria);
		const shouldLoad = total > stories.length && !op;

		const sortStories = sort =>
			dispatch(navigateToQuery({_sort: sort + ':' + SORT_DIRECTION.desc}));

		const handleLoadStories = useCallback(
			(op, _start) =>
				criteria &&
				dispatch(
					loadStories(
						{
							...criteria,
							_start,
						},

						op
					)
				),
			[dispatch, criteria]
		);

		useEffect(() => {
			!isEqual(criteria, prevCriteria) && handleLoadStories(undefined, 0);
		}, [handleLoadStories, criteria, prevCriteria]);

		return (
			<div className={CLASS}>
				{displayNav && (
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
				)}
				{displaySearch && (
					<SearchInput
						placeholder="Search stories"
						defaultValue={title_contains}
						urlParamName="title_contains"
					/>
				)}
				<LoadMore
					id="stories"
					onLoadMore={() => handleLoadStories(STORY_OP.load_more, stories.length)}
					shouldLoad={shouldLoad}
					total={total}
					loading={[STORY_OP.loading, STORY_OP.load_more].includes(op)}
					showItems={op !== STORY_OP.loading}
					NoItemsComponent={NoItemsComponent}
					noItemsComponentProps={noItemsComponentProps}
				>
					<div className={CLASS + '-lastest'}>
						{stories.map(item => (
							<StoryItem id={item.id} size={MEDIA_SIZE.small} key={item.id} />
						))}
					</div>
				</LoadMore>
			</div>
		);
	}
);

Stories.displayName = 'Stories';

Stories.propTypes = {
	criteria: propTypes.object,
	activeSort: propTypes.string,
	displaySearch: propTypes.bool,
	displayNav: propTypes.bool,
	NoItemsComponent: propTypes.func,
	noItemsComponentProps: propTypes.object,
};

Stories.defaultProps = {
	criteria: DEFAULT_CRITERIA,
	displaySearch: true,
	displayNav: true,
	NoItemsComponent: NoStories,
	noItemsComponentProps: {},
};

const MemoizedStories = ({
	criteria,
	displaySearch,
	displayNav,
	NoItemsComponent,
	noItemsComponentProps,
}) => {
	const query = useGetSearchParams();

	const newCriteria = {...criteria, ...query};

	const activeSort = newCriteria._sort
		? newCriteria._sort.split(':')[0]
		: STORY_SORT.published_at;

	delete newCriteria.fbclid;
	delete newCriteria.ref;

	return (
		<Stories
			criteria={newCriteria}
			activeSort={activeSort}
			displaySearch={displaySearch}
			displayNav={displayNav}
			NoItemsComponent={NoItemsComponent}
			noItemsComponentProps={noItemsComponentProps}
		/>
	);
};

MemoizedStories.propTypes = {
	criteria: propTypes.object,
	displaySearch: propTypes.bool,
	displayNav: propTypes.bool,
	NoItemsComponent: propTypes.func,
	noItemsComponentProps: propTypes.object,
};

export default MemoizedStories;
