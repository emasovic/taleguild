import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Helmet} from 'react-helmet';
import orderBy from 'lodash/orderBy';
import {useParams} from 'react-router-dom';

import ENV from 'env';

import {loadStory, selectStory} from 'redux/story';
import {selectUser} from 'redux/user';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';
import StoryItem from './StoryItem';
import NotFound from 'NotFound';

import './Story.scss';

const CLASS = 'st-Story';

const URL = 'https://api.taleguild.com';

export default function Story() {
	const {id} = useParams();
	const viewerRef = useRef(null);
	const dispatch = useDispatch();
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
			<Helmet>
				<title>{story.title}</title>
				<meta name="title" content={story.title} />
				<meta name="description" content={story.description} />
				{story.image && (
					<link rel="apple-touch-icon" href={ENV.api.url + story.image.url} />
				)}

				<meta property="og:title" content={story.title} />
				<meta property="og:description" content={story.description} />
				{story.image && (
					<meta property="og:image" content={ENV.api.url + story.image.url} />
				)}

				<meta property="twitter:title" content={story.title} />
				<meta property="twitter:description" content={story.description} />
				{story.image && (
					<meta property="twitter:image" content={ENV.api.url + story.image.url} />
				)}
			</Helmet>
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
