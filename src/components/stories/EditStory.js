import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';

import {selectStory, loadStory} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';
import NewStory from './NewStory';

export default function EditStory() {
	const params = useParams();
	const dispatch = useDispatch();

	const {story} = useSelector(state => ({
		story: selectStory(state, params.id),
	}));

	useEffect(() => {
		dispatch(loadStory(params.id));
	}, [dispatch, params.id]);

	if (!story) {
		return <Loader />;
	}
	return <NewStory story={story} />;
}
