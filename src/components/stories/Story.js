import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Helmet} from 'react-helmet';
import orderBy from 'lodash/orderBy';
import {useParams} from 'react-router-dom';

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
				<meta property="og:description" content={story.description} />
				<meta property="og:description" content={story.description} />
				<meta
					property="og:image"
					content="https://image.shutterstock.com/image-photo/butterfly-grass-on-meadow-night-260nw-1111729556.jpg"
				/>
				<meta
					property="og:image:secure_url"
					content="https://image.shutterstock.com/image-photo/butterfly-grass-on-meadow-night-260nw-1111729556.jpg"
				/>
				<meta property="og:image:type" content="image/jpeg" />
				<meta property="og:image:width" content="50" />
				<meta property="og:image:height" content="50" />
				<meta property="og:image:alt" content="A shiny red apple with a bite taken out" />
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
