import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser} from 'redux/user';
import {selectStories, loadStories} from 'redux/draft_stories';

import StoryThumb from 'components/stories/StoryThumb';

import Loader from 'components/widgets/loader/Loader';
import IconButton from 'components/widgets/button/IconButton';

import './DraftStories.scss';

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

	const [currentPage, setCurrentPage] = useState(1);
	const [shouldCount, setShouldCount] = useState(true);
	const [criteria, setCriteria] = useState();

	const handleCount = () => {
		setCriteria({...criteria, _start: currentPage * 10});
		setCurrentPage(currentPage + 1);
		shouldCount && setShouldCount(false);
	};

	useEffect(() => {
		if (data) {
			setCriteria({
				...DEFAULT_CRITERIA,

				published: false,
				'user.id': data && data.id,
			});
		}
	}, [data]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria, shouldCount));
		}
	}, [dispatch, shouldCount, criteria]);

	const drafts =
		stories && stories.length
			? stories.map(item => {
					return (
						<StoryThumb
							id={item.id}
							image={item.image}
							title={item.title || 'Untitled'}
							description={item.description}
							key={item.id}
							// author={item.user}
							createdDate={item.created_at}
						/>
					);
			  })
			: <span>No stories found</span>;

	return (
		<div className={CLASS}>
			<span>Drafts</span>
			{loading ? <Loader /> : drafts}

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
