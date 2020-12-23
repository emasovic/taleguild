import React, {useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {COLOR} from 'types/button';

import {selectUser as selectLoggedUser} from 'redux/user';
import {loadUser, selectUser} from 'redux/users';
import {selectFollowers, createOrDeleteFollower} from 'redux/followers';

import IconButton from 'components/widgets/button/IconButton';

import Followers from './followers/Followers';
import FollowedBy from './followers/Following';

import UserAvatar from './UserAvatar';

export default function UserProfileInfo({userId, className}) {
	const dispatch = useDispatch();
	const {total, followers, followersLoading, user, loggedUser} = useSelector(
		state => ({
			followers: selectFollowers(state, userId),
			loggedUser: selectLoggedUser(state),
			user: selectUser(state, userId),
			followersLoading: state.followers.loading,
			total: state.stories.total,
		}),
		shallowEqual
	);

	const {data} = loggedUser;

	let follower = null;

	if (data) {
		follower =
			followers && followers.length && followers.find(item => item.follower.id === data.id);
	}

	const handleFollow = () => {
		dispatch(createOrDeleteFollower(follower, userId, data && data.id));
	};

	const label = follower ? 'Unfollow' : 'Follow';

	const info = (
		<>
			<div className={className + '-user-info-stats'}>
				<div className={className + '-user-info-stats-stories'}>
					<span>{total}</span>
					<span>Stories</span>
				</div>
				<Followers id={userId} />
				<FollowedBy id={userId} />
			</div>
			{data && Number(userId) !== data.id && (
				<IconButton
					color={COLOR.secondary}
					disabled={followersLoading}
					onClick={handleFollow}
				>
					{label}
				</IconButton>
			)}
		</>
	);

	useEffect(() => {
		dispatch(loadUser(userId));
	}, [dispatch, userId]);

	if (!user) {
		return null;
	}

	const {display_name, username, description} = user;

	return (
		<div className={className + '-user'}>
			<UserAvatar user={user} />
			<div className={className + '-user-info'}>
				<div className={className + '-user-info-description'}>
					<span>{display_name || username}</span>
					<span>{description}</span>
				</div>

				{info}
			</div>
		</div>
	);
}
