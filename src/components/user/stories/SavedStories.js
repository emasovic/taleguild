import React, {useEffect, useState} from 'react';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUserSavedStories, loadSavedStories} from 'redux/saved_stories';
import {selectUser} from 'redux/user';

import StoryThumb from 'components/stories/StoryThumb';

import Loader from 'components/widgets/loader/Loader';
import IconButton from 'components/widgets/button/IconButton';

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

	const [currentPage, setCurrentPage] = useState(1);
	const [shouldCount, setShouldCount] = useState(true);
	const [criteria, setCriteria] = useState();

	const handleCount = () => {
		setCriteria({...criteria, _start: currentPage * 10});
		setCurrentPage(currentPage + 1);
		shouldCount && setShouldCount(false);
	};

	const {data} = user;

	useEffect(() => {
		if (data) {
			setCriteria({...DEFAULT_CRITERIA, published: undefined, user: data.id});
		}
	}, [data]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadSavedStories(criteria, shouldCount));
		}
	}, [dispatch, shouldCount, criteria]);

	const stories =
		savedStories && savedStories.length ? (
			savedStories.map(item => {
				const {story} = item;
				if (!story) {
					return null;
				}
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
		) : (
			<span>No stories found</span>
		);

	return (
		<div className={CLASS}>
			<span>Saved stories</span>
			{loading ? <Loader /> : stories}
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
