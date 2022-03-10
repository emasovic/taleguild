import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {nanoid} from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {selectStory} from 'redux/story';
import {createUserActivity} from 'redux/userActivity';

const ACTIVITY = {
	startAt: null,
	endAt: null,
};

export default function useFocus() {
	const dispatch = useDispatch();
	const {id: storyId} = useParams();
	const {published} = useSelector(state => selectStory(state, storyId));

	const [activities, setActivities] = useState({[nanoid()]: ACTIVITY});
	const activitiesRef = useRef(activities);

	const lastActivityKey = Object.keys(activities).pop();
	const lastActivityVal = activities[lastActivityKey];

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
		activitiesRef.current = activities;
	}, [activities]);

	useEffect(() => {
		return () =>
			!published &&
			dispatch(createUserActivity({activity: activitiesRef.current, story: storyId}));
	}, [dispatch, published, storyId]);

	return [handleStartAt, handleEndAt];
}
