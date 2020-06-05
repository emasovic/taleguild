import React, {useEffect, useState} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUserSavedStories, loadSavedStories} from 'redux/saved_stories';
import {selectUser} from 'redux/user';

import StoryThumb from 'components/stories/StoryThumb';

import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';

import './SavedStories.scss';

const CLASS = 'st-SavedStories';

export default function SavedStories() {
	const dispatch = useDispatch();
	const {savedStories, user, pages, loading} = useSelector(
		state => ({
			savedStories: selectUserSavedStories(state),
			loading: state.saved_stories.loading,
			pages: state.saved_stories.pages,
			user: selectUser(state),
		}),
		shallowEqual
	);
	const [count, setCount] = useState(0);
	const [shouldCount, setShouldCount] = useState(true);
	const [criteria, setCriteria] = useState();

	const handleCount = page => {
		setCount(page * 12);
		shouldCount && setShouldCount(false);
	};

	const {data} = user;

	useEffect(() => {
		if (data) {
			setCriteria({...DEFAULT_CRITERIA, _start: count, published: undefined, user: data.id});
		}
	}, [dispatch, data, count, shouldCount]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadSavedStories(criteria, shouldCount));
		}
	}, [dispatch, shouldCount, criteria]);

	if (loading) {
		return <Loader />;
	}
	return (
		<div className={CLASS}>
			<span>Saved stories</span>
			{savedStories && savedStories.length
				? savedStories.map(item => {
						const {story} = item;
						return (
							<StoryThumb
								id={story.id}
								image={story.image}
								title={story.title}
								description={story.description}
								key={item.id}
								author={story.user}
								createdDate={story.created_at}
							/>
						);
				  })
				: null}
			<div className={CLASS + '-pagination'}>
				{!!pages && <Pages pages={pages} onClick={handleCount} />}
			</div>
		</div>
	);
}
