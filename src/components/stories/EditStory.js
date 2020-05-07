import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectStory, loadStory} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';
import NewStory from './NewStory';

export default function EditStory(props) {
	const {id} = props.match.params;
	const dispatch = useDispatch();

	const {story} = useSelector(state => ({
		story: selectStory(state, id),
	}));

	useEffect(() => {
		dispatch(loadStory(id));
	}, [dispatch, id]);

	if (!story) {
		return <Loader />;
	}
	return <NewStory story={story} />;
}
