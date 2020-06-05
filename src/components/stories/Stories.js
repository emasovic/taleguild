import React, {useEffect, useState} from 'react';
import {NavItem, NavLink, Nav} from 'reactstrap';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import propTypes from 'prop-types';
import moment from 'moment';

import {loadStories, selectStories} from '../../redux/story';

import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';

import StoryItem from './StoryItem';

import './Stories.scss';
import {DEFAULT_CRITERIA} from 'types/story';

const CLASS = 'st-Stories';

const SORT = {
	recent: 'recent',
	popular: 'popular',
};

export default function Stories({criteria}) {
	const dispatch = useDispatch();
	const {data, loading, pages} = useSelector(
		state => ({
			data: selectStories(state),
			pages: state.stories.pages,
			loading: state.stories.loading,
		}),
		shallowEqual
	);

	const [count, setCount] = useState(0);
	const [shouldCount, setShouldCount] = useState(true);
	const [storyCriteria, setStoryCriteria] = useState(null);
	const [activeSort, setActiveSort] = useState(SORT.recent);

	const sortStories = (sort, criteria) => {
		setActiveSort(sort);
		setStoryCriteria(criteria);
	};

	const handleCount = page => {
		setCount(page * 12);
		shouldCount && setShouldCount(false);
	};

	useEffect(() => {
		if (criteria) {
			criteria._start = count;
			setStoryCriteria(criteria);
		}
	}, [count, criteria]);

	useEffect(() => {
		if (storyCriteria) {
			dispatch(loadStories(storyCriteria, shouldCount));
		}
	}, [dispatch, shouldCount, storyCriteria]);

	const renderStories =
		data && data.length ? (
			data.map(item => {
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
				{!!pages && <Pages pages={pages} onClick={handleCount} />}
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
