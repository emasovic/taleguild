import React, {useEffect} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser} from 'redux/user';
import {loadFollowers, selectFollowers} from 'redux/followers';

import Loader from './widgets/loader/Loader';

import Explore from './Explore';

export default function Home() {
	const dispatch = useDispatch();
	const {userId, followers} = useSelector(state => {
		const {data} = selectUser(state);
		const userId = data && data.id;

		return {
			followers: selectFollowers(state, userId),
			userId,
		};
	}, shallowEqual);

	useEffect(() => {
		if (userId) {
			dispatch(loadFollowers({follower: userId}));
		}
	}, [dispatch, userId]);

	if (!userId) {
		return <Loader />;
	}

	const userIds = followers && followers.length ? followers.map(item => item.follower.id) : [];
	const criteria = {...DEFAULT_CRITERIA, user_in: userIds};

	return <Explore criteria={criteria} />;
}
