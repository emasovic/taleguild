import React, {useEffect} from 'react';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {loggedUserId} from 'redux/user';
import {selectFollowing, loadFollowing} from 'redux/following';

import Loader from 'components/widgets/loader/Loader';

import Explore from './Explore';

export default function Home() {
	const dispatch = useDispatch();
	const {userId, following, loading} = useSelector(state => {
		const userId = loggedUserId(state);
		return {
			following: selectFollowing(state, userId),
			loading: state.following.loading,
			userId,
		};
	}, shallowEqual);

	useEffect(() => {
		if (userId) {
			dispatch(loadFollowing({follower: userId}));
		}
	}, [dispatch, userId]);

	if (!userId || loading || !following) {
		return <Loader />;
	}

	const userIds = following && following.length ? following.map(item => item.user.id) : [];

	const criteria = {...DEFAULT_CRITERIA, user_in: [...userIds, userId]};

	return <Explore criteria={criteria} />;
}
