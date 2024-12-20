import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import orderBy from 'lodash.orderby';
import {useHistory, useParams} from 'react-router-dom';

import {goToStory, DASHBOARD} from 'lib/routes';

import {getIdFromSlug} from 'types/story';
import {COLOR} from 'types/button';

import {loadStory, selectStory} from 'redux/story';
import {createOrUpdateViews} from 'redux/views';
import {selectUserId} from 'redux/auth';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';
import Helmet from 'components/widgets/helmet/Helmet';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import {ReactComponent as ArchivedStory} from 'images/file-archive.svg';

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

	const story = useSelector(state => selectStory(state, id));
	const userId = useSelector(selectUserId);

	const storyUser = story?.user?.id || story?.user;

	const [activePage, setActivePage] = useState(0);

	const scrollToStory = () => window.scrollTo(0, 0);

	const handleActivePage = page => {
		setActivePage(page);
		scrollToStory();
	};

	useEffect(() => {
		dispatch(createOrUpdateViews(id, userId));
	}, [dispatch, id, userId]);

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

	if (!story.publishedAt && storyUser !== userId) {
		return <NotFound />;
	}

	if (story.archivedAt && storyUser !== userId) {
		return (
			<PagePlaceholder
				className={CLASS + '-placeholder'}
				IconComponent={ArchivedStory}
				buttonLabel="Back to dashboard"
				title="The story is archived"
				subtitle="The writer has archived this story and it is no longer public."
				to={DASHBOARD}
				buttonProps={{color: COLOR.secondary}}
			/>
		);
	}

	let {storypages} = story;
	storypages =
		storypages && storypages.length
			? orderBy(
					storypages.map(item => ({...item, text: JSON.parse(item.text)})),
					['createdAt'],
					['asc']
			  )
			: [];
	return (
		<MobileWrapper className={CLASS} ref={viewerRef}>
			<Helmet title={story.title} description={story.description} />
			<StoryItem id={story.id} keepArchived />

			{storypages[activePage] && <TextViewer value={storypages[activePage].text} />}

			{storypages && <Pages onClick={handleActivePage} pages={storypages.length} />}
			<div className={CLASS + '-pages'}>{storypages.length} pages total</div>
		</MobileWrapper>
	);
}
