import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import orderBy from 'lodash/orderBy';
import {useHistory, useParams} from 'react-router-dom';

import {goToStory} from 'lib/routes';

import {getIdFromSlug} from 'types/story';

import {loadStory, selectStory} from 'redux/story';
import {selectUser} from 'redux/user';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';
import StoryItem from './StoryItem';
import NotFound from 'NotFound';

import './Story.scss';

const CLASS = 'st-Story';

export default function Story() {
	const {slug} = useParams();
	const history = useHistory();
	const viewerRef = useRef(null);
	const dispatch = useDispatch();

	const id = getIdFromSlug(slug);

	const {story, loggedUser} = useSelector(
		state => ({
			story: selectStory(state, id),

			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = loggedUser;

	const loggedUserId = data && data.id;

	const [activePage, setActivePage] = useState(0);

	const scrollToStory = () => window.scrollTo(0, 0);

	const handleActivePage = page => {
		setActivePage(page);
		scrollToStory();
	};

	useEffect(() => {
		dispatch(loadStory(id));
		scrollToStory();
	}, [dispatch, id]);

	useEffect(() => {
		if (story && story.slug) {
			history.replace(goToStory(story.slug));
		}
	}, [history, story]);

	if (!story) {
		return (
			<div className={CLASS}>
				<Loader />
			</div>
		);
	}

	if (!story.published && story.user.id !== loggedUserId) {
		return <NotFound />;
	}

	let {storypages} = story;
	storypages =
		storypages && storypages.length
			? orderBy(
					storypages.map(item => ({...item, text: JSON.parse(item.text)})),
					['created_at'],
					['asc']
			  )
			: [];

	return (
		<div className={CLASS} ref={viewerRef}>
			<StoryItem
				id={story.id}
				image={story.image}
				title={story.title}
				description={story.description}
				key={story.id}
				categories={story.categories}
				likes={story.likes}
				comments={story.comments}
				storypages={story.storypages}
				author={story.user}
				createdDate={story.created_at}
				savedBy={story.saved_by}
			/>

			{storypages[activePage] && <TextViewer value={storypages[activePage].text} />}

			{storypages && <Pages onClick={handleActivePage} pages={storypages.length} />}
			<div className={CLASS + '-pages'}>{storypages.length} pages total</div>
		</div>
	);
}
