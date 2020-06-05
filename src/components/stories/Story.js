import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {useParams, Redirect} from 'react-router-dom';

import {HOME} from 'lib/routes';

import {loadStory, selectStory} from 'redux/story';
import {selectUser} from 'redux/user';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';
import StoryItem from './StoryItem';

import './Story.scss';

const CLASS = 'st-Story';

export default function Story({previewStory}) {
	const {id} = useParams();

	const dispatch = useDispatch();
	const {story} = useSelector(
		state => ({
			story: selectStory(state, id),

			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const [activePage, setActivePage] = useState(0);

	useEffect(() => {
		dispatch(loadStory(id));
	}, [dispatch, id]);

	if (!story) {
		return (
			<div className={CLASS}>
				<Loader />
			</div>
		);
	}

	if (!story.published) {
		return <Redirect to={HOME} />;
	}

	let {storypages} = story;
	storypages = storypages.map(item => ({...item, text: JSON.parse(item.text)}));

	return (
		<div className={CLASS}>
			<StoryItem
				id={story.id}
				image={story.image}
				title={story.title}
				description={story.description}
				key={story.id}
				categories={story.categories}
				likes={story.likes}
				comments={story.comments}
				author={story.user}
				createdDate={story.created_at}
				savedBy={story.saved_by}
			/>

			{storypages[activePage] && <TextViewer value={storypages[activePage].text} />}

			{storypages && (
				<Pages onClick={setActivePage} prefix="Page" pages={storypages.length} />
			)}
		</div>
	);
}
