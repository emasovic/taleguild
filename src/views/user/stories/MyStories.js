import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {DEFAULT_CRITERIA, STORY_COMPONENTS} from 'types/story';

import {selectUser} from 'redux/user';
import {selectStories, loadStories} from 'redux/userStories';

import Loader from 'components/widgets/loader/Loader';
import IconButton from 'components/widgets/button/IconButton';
import NoStories from 'views/stories/NoStories';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function MyStories({Component}) {
	const dispatch = useDispatch();
	const {stories, loading, pages, loggedInUser} = useSelector(
		state => ({
			loggedInUser: selectUser(state),
			stories: selectStories(state),
			pages: state.userStories.pages,
			loading: state.userStories.loading,
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
			setCriteria({...DEFAULT_CRITERIA, user: data && data.id});
		}
	}, [data]);

	useEffect(() => {
		if (criteria) {
			dispatch(loadStories(criteria));
		}
	}, [dispatch, criteria]);

	const myStories =
		stories && stories.length ? (
			stories.map(item => {
				return (
					<Component
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
						createdDate={item.published_at}
						savedBy={item.saved_by}
						slug={item.slug}
					/>
				);
			})
		) : (
			<NoStories />
		);

	return (
		<div className={CLASS}>
			<span>MY STORIES</span>
			{loading ? <Loader /> : myStories}
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

MyStories.propTypes = {
	Component: PropTypes.any,
};

MyStories.defaultProps = {
	Component: STORY_COMPONENTS.list,
};
