import React, {useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_CRITERIA} from 'types/story';

import {selectUser, loadUser} from 'redux/users';

import Stories from 'components/stories/Stories';
import Loader from 'components/widgets/loader/Loader';
import UserAvatar from './UserAvatar';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const params = useParams();
	const dispatch = useDispatch();
	const {user} = useSelector(
		state => ({
			user: selectUser(state, params.id),
		}),
		shallowEqual
	);

	useEffect(() => {
		dispatch(loadUser(params.id));
	}, [dispatch, params.id]);

	if (!user) return <Loader />;
	const {display_name, username, description} = user;

	return (
		<div className={CLASS}>
			<div className={CLASS + '-user'}>
				<UserAvatar user={user} />
				<span>{display_name || username}</span>
				<span>{description}</span>
			</div>
			<Stories criteria={{'user.id': user && user.id, ...DEFAULT_CRITERIA}} />
		</div>
	);
}
