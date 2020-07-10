import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser, loadUser} from 'redux/users';

import Stories from 'components/stories/Stories';
import Loader from 'components/widgets/loader/Loader';

import UserProfileInfo from './UserProfileInfo';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const {id} = useParams();

	const dispatch = useDispatch();

	const user = useSelector(state => selectUser(state, id));

	useEffect(() => {
		dispatch(loadUser(id));
	}, [dispatch, id]);

	if (!user) return <Loader />;

	return (
		<div className={CLASS}>
			<UserProfileInfo user={user} className={CLASS} />
			<Stories criteria={{...DEFAULT_CRITERIA, user: user && user.id}} />
		</div>
	);
}
