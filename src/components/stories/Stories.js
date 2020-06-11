import React, {useEffect, useState} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import propTypes from 'prop-types';
import moment from 'moment';
import orderBy from 'lodash/orderBy';

import {DEFAULT_CRITERIA} from 'types/story';

import {loadStories, selectStories} from '../../redux/story';

import Loader from 'components/widgets/loader/Loader';
import IconButton from 'components/widgets/button/IconButton';

import StoryItem from './StoryItem';

import './Stories.scss';

const CLASS = 'st-Stories';

const SORT = {
	recent: 'created_at',
	popular: 'likes_count',
};

export default function Stories({criteria, filter}) {
	const dispatch = useDispatch();
	const {stories, loading, pages} = useSelector(
		state => ({
			stories: selectStories(state),
			pages: state.stories.pages,
			loading: state.stories.loading,
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [shouldCount, setShouldCount] = useState(true);
	const [storyCriteria, setStoryCriteria] = useState(null);
	const [activeSort, setActiveSort] = useState(SORT.recent);

	const sortStories = (sort, criteria) => {
		setActiveSort(sort);
		setStoryCriteria(criteria);
	};

	const handleCount = () => {
		setStoryCriteria({...storyCriteria, _start: currentPage * 10});
		setCurrentPage(currentPage + 1);
		shouldCount && setShouldCount(false);
	};

	useEffect(() => {
		if (criteria) {
			setStoryCriteria(criteria);
		}
	}, [criteria]);

	useEffect(() => {
		if (storyCriteria) {
			dispatch(loadStories(storyCriteria, shouldCount, false, filter));
		}
	}, [dispatch, storyCriteria, shouldCount, filter]);

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
		<div className={CLASS}>
			<Nav className={CLASS + '-header'}>
				<NavItem href="#" onClick={() => sortStories(SORT.recent, criteria)}>
					<NavLink active={activeSort === SORT.recent}>Recent stories</NavLink>
				</NavItem>
				<NavItem
					href="#"
					onClick={() =>
						sortStories(SORT.popular, {
							...storyCriteria,
							_sort: 'likes_count:DESC',
							created_at_gte: moment().subtract(10, 'days'),
						})
					}
				>
					<NavLink active={activeSort === SORT.popular}>Popular stories</NavLink>
				</NavItem>
			</Nav>
			<div className={CLASS + '-lastest'}>{loading ? <Loader /> : renderStories}</div>
			<div className={CLASS + '-pagination'}>
				{pages > currentPage && (
					<IconButton onClick={handleCount} loading={loading}>
						Load More
					</IconButton>
				)}
			</div>
		</div>
	);
}

Stories.propTypes = {
	criteria: propTypes.object,
};

Stories.defaultProps = {
	criteria: DEFAULT_CRITERIA,
};
