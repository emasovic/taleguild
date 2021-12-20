import React, {useEffect, useCallback, useState, useMemo, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {nanoid} from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';

import {DEFAULT_STORYPAGE_DATA, PUBLISH_STATES} from 'types/story';

import {
	loadStoryPages,
	createOrUpdateStoryPage,
	selectStoryPages,
	loadStoryPage,
} from 'redux/storyPages';
import {selectStory} from 'redux/story';
import {createUserActivity} from 'redux/userActivity';

import Loader from 'components/widgets/loader/Loader';

import Header from './Header';
import Writter from './Writter';

import './StoryWritter.scss';

const ACTIVITY = {
	startAt: null,
	endAt: null,
};

const CLASS = 'st-StoryWritter';

export default function StoryWritter() {
	const dispatch = useDispatch();
	const {id: storyId, pageId} = useParams();

	const pages = useSelector(selectStoryPages);
	const story = useSelector(state => selectStory(state, storyId));
	const {loading, op} = useSelector(state => state.storyPages);

	const [selectedPage, setSelectedPage] = useState(0);
	const [current, handleCurrent] = useState(null);
	const [activities, setActivities] = useState({[nanoid()]: ACTIVITY});
	const lastActivityKey = Object.keys(activities).pop();
	const lastActivityVal = activities[lastActivityKey];

	const published = !!story?.published_at;

	const activitiesRef = useRef(activities);

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

	const handleStartAt = useCallback(() => {
		if (!lastActivityVal?.startAt) {
			setActivities(prevState => ({
				...prevState,
				[lastActivityKey]: {...lastActivityVal, startAt: new Date()},
			}));
		}
		if (lastActivityVal?.endAt) {
			setActivities(prevState => ({
				...prevState,
				[nanoid()]: ACTIVITY,
			}));
		}
	}, [lastActivityVal, lastActivityKey]);

	const handleEndAt = useMemo(
		() =>
			debounce(() => {
				lastActivityVal?.startAt &&
					setActivities(prevState => ({
						...prevState,
						[lastActivityKey]: {...lastActivityVal, endAt: new Date()},
					}));
			}, 3000),
		[lastActivityKey, lastActivityVal]
	);

	useEffect(() => {
		dispatch(loadStoryPages({story: storyId, _publicationState: PUBLISH_STATES.preview}));
	}, [dispatch, storyId]);

	useEffect(() => {
		if (pages?.length) {
			let index = pages.findIndex(item => item.id === Number(pageId));
			index = index < 0 ? 0 : index;
			handleCurrent(pages[index]);
			setSelectedPage(index);
		}
	}, [pages, pageId]);

	useEffect(() => {
		dispatch(
			loadStoryPage({
				id: pageId,
			})
		);
	}, [dispatch, pageId]);

	useEffect(() => {
		activitiesRef.current = activities;
	}, [activities]);

	useEffect(() => {
		return () =>
			!published &&
			dispatch(createUserActivity({activity: activitiesRef.current, story: storyId}));
	}, [dispatch, storyId, published]);

	if (!pages || loading || !current || !story) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<Header
				className={CLASS}
				pages={pages}
				op={op}
				story={story}
				currentEditing={current}
				selectedPage={selectedPage}
				onStoryPage={handleStoryPage}
				storyId={storyId}
				pageId={pageId}
			/>

			<Writter
				className={CLASS}
				currentEditing={current}
				published={published}
				archived={!!story?.archived_at}
				onCurrentChange={handleCurrent}
				onStoryPage={handleStoryPage}
				onStartAt={handleStartAt}
				onEndAt={handleEndAt}
				op={op}
			/>
		</div>
	);
}
