import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser} from 'redux/user';
import {selectStories, loadStories} from 'redux/user_stories';

import Loader from 'components/widgets/loader/Loader';
import StoryThumb from 'components/stories/StoryThumb';

import './MyStories.scss';

const CLASS = 'st-MyStories';

export default function MyStories() {
	const dispatch = useDispatch();
	const {stories, loading, loggedInUser} = useSelector(
		state => ({
			loggedInUser: selectUser(state),
			stories: selectStories(state),
			pages: state.user_stories.pages,
			loading: state.user_stories.loading,
		}),
		shallowEqual
	);
	const {data} = loggedInUser;

	// const [count, setCount] = useState(0);
	// const [shouldCount, setShouldCount] = useState(true);
	const [criteria, setCriteria] = useState();

	useEffect(() => {
		if (data) {
			setCriteria({...DEFAULT_CRITERIA, 'user.id': data && data.id});
		}
	}, [data]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria));
		}
	}, [dispatch, criteria]);

	if (loading) return <Loader />;

	return (
		<div className={CLASS}>
			<span>MY STORIES</span>
			{stories && stories.length
				? stories.map(item => {
						return (
							<StoryThumb
								id={item.id}
								image={item.image}
								title={item.title}
								description={item.description}
								key={item.id}
								// author={item.user}
								createdDate={item.created_at}
							/>
						);
				  })
				: null}
		</div>
	);
}
