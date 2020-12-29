import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_CRITERIA} from 'types/story';

import {loadUser, selectUserByUsername} from 'redux/users';

import Loader from 'components/widgets/loader/Loader';

import Stories from 'views/stories/Stories';

import UserProfileInfo from './UserProfileInfo';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const {username} = useParams();
	const dispatch = useDispatch();

	const user = useSelector(state => selectUserByUsername(state, username));

	useEffect(() => {
		dispatch(loadUser(username));
	}, [dispatch, username]);

	if (!user) {
		return <Loader />;
	}
	return (
		<div className={CLASS}>
			<UserProfileInfo user={user} className={CLASS} />
			<Stories criteria={{...DEFAULT_CRITERIA, user: user?.id}} />
		</div>
	);
}
