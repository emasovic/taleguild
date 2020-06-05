import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser} from 'redux/user';
import {selectStories, loadStories} from 'redux/draft_stories';

import Loader from 'components/widgets/loader/Loader';
import StoryThumb from 'components/stories/StoryThumb';

import './DraftStories.scss';
import Pages from 'components/widgets/pagination/Pagination';

const CLASS = 'st-DraftStories';

export default function DraftStories() {
	const dispatch = useDispatch();
	const {stories, loading, pages, loggedInUser} = useSelector(
		state => ({
			loggedInUser: selectUser(state),
			stories: selectStories(state),
			pages: state.drafts.pages,
			loading: state.drafts.loading,
		}),
		shallowEqual
	);
	const {data} = loggedInUser;

	const [count, setCount] = useState(0);
	const [shouldCount, setShouldCount] = useState(true);
	const [criteria, setCriteria] = useState();

	const handleCount = page => {
		setCount(page * 12);
		shouldCount && setShouldCount(false);
	};

	useEffect(() => {
		if (data) {
			setCriteria({
				...DEFAULT_CRITERIA,
				_start: count,
				published: false,
				'user.id': data && data.id,
			});
		}
	}, [data, count]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria, shouldCount));
		}
	}, [dispatch, shouldCount, criteria]);

	if (loading) return <Loader />;

	return (
		<div className={CLASS}>
			<span>Drafts</span>
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
			<div className={CLASS + '-pagination'}>
				{!!pages && <Pages pages={pages} onClick={handleCount} />}
			</div>
		</div>
	);
}
