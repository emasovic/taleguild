import React, {useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_STORYPAGE_DATA, PUBLISH_STATES} from 'types/story';

import {
	loadStoryPages,
	createOrUpdateStoryPage,
	selectStoryPages,
	loadStoryPage,
} from 'redux/storyPages';
import {selectStory} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';

import Header from './Header';
import Writter from './Writter';

import './StoryWritter.scss';

const CLASS = 'st-StoryWritter';

export default function StoryWritter() {
	const dispatch = useDispatch();
	const {id: storyId, pageId} = useParams();

	const pages = useSelector(selectStoryPages);

	const story = useSelector(state => selectStory(state, storyId));
	const {loading, op} = useSelector(state => state.storyPages);

	const published = !!story?.publishedAt;

	const handleStoryPage = useCallback(
		(id, text) => {
			dispatch(
				createOrUpdateStoryPage({
					story: storyId,
					id,
					text: text || DEFAULT_STORYPAGE_DATA,
				})
			);
		},
		[dispatch, storyId]
	);

	useEffect(() => {
		dispatch(
			loadStoryPages({
				filters: {story: Number(storyId)},
				publicationState: PUBLISH_STATES.preview,
			})
		);
	}, [dispatch, storyId]);

	useEffect(() => {
		dispatch(
			loadStoryPage({
				id: pageId,
			})
		);
	}, [dispatch, pageId]);

	if (!pages || loading || !story) return <Loader />;

	return (
		<div className={CLASS}>
			<Header
				className={CLASS}
				pages={pages}
				op={op}
				story={story}
				onStoryPage={handleStoryPage}
				storyId={storyId}
				pageId={pageId}
			/>

			<Writter
				className={CLASS}
				pages={pages}
				pageId={pageId}
				published={published}
				archived={!!story?.archived_at}
				onStoryPage={handleStoryPage}
				op={op}
			/>
		</div>
	);
}
