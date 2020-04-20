import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {loadStories, selectStories} from '../../redux/storySlice';

export default function Stories() {
	const dispatch = useDispatch();
	const stoires = useSelector(selectStories);

	useEffect(() => {
		dispatch(loadStories());
	}, []);
	console.log('>>>>>>>>>>>>>....', stoires);
	return <div></div>;
}
