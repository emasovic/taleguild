import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import debounce from 'lodash/debounce';
import propTypes from 'prop-types';

import {loadStories, selectStories} from '../../redux/story';

import Input from 'components/widgets/input/Input';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';

import StoryItem from './StoryItem';
import Categories from './Categories';

import './Stories.scss';

const CLASS = 'st-Stories';

export default function Stories({criteria, editMode, displayCategoies}) {
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

	criteria._start = count;

	const _searchStory = name => {
		dispatch(loadStories({title_contains: name, ...criteria}));
	};

	const searchStory = debounce(_searchStory, 500);

	const handleCount = page => {
		setCount(page * 12);
		shouldCount && setShouldCount(false);
	};

	useEffect(() => {
		dispatch(loadStories(criteria, shouldCount));
	}, [dispatch, count, shouldCount, criteria]);

	const renderStories =
		data && data.length ? (
			data.map(item => (
				<StoryItem
					id={item.id}
					image={item.image}
					title={item.title}
					text={item.description}
					key={item.id}
					categories={item.categories}
					likes={item.likes}
					comments={item.comments}
					creator={item.user && item.user.username}
					createdDate={item.created_at}
					editMode={editMode}
				/>
			))
		) : (
			<h2>Nema pronadjenih rezultata</h2>
		);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-header'}>
				{displayCategoies && <Categories />}
				<div className={CLASS + '-header-filter'}>
					<Input onChange={val => searchStory(val)} placeholder="Unesite ime priče..." />
				</div>
			</div>
			<div className={CLASS + '-lastest'}>{loading ? <Loader /> : renderStories}</div>
			<div className={CLASS + '-pagination'}>
				{!!pages && <Pages pages={pages} onClick={handleCount} />}
			</div>
		</div>
	);
}

Stories.propTypes = {
	criteria: propTypes.object,
	displayCategoies: propTypes.bool,
};

Stories.defaultProps = {
	criteria: {_start: 0, _limit: 12, _sort: 'created_at:DESC', published: true},
	displayCategoies: true,
};
