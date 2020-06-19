import React from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useParams} from 'react-router-dom';

import {COLOR} from 'types/button';

import {selectUser as selectLoggedUser} from 'redux/user';
import {selectFollowers, createOrDeleteFollower} from 'redux/followers';

import IconButton from 'components/widgets/button/IconButton';
import Loader from 'components/widgets/loader/Loader';

import Followers from './followers/Followers';
import FollowedBy from './followers/Following';

import UserAvatar from './UserAvatar';

export default function UserProfileInfo({user, className}) {
	const {id} = useParams();
	const dispatch = useDispatch();
	const {total, followers, storiesLoading, followersLoading, loggedUser} = useSelector(
		state => ({
			followers: selectFollowers(state, id),
			loggedUser: selectLoggedUser(state),
			followersLoading: state.followers.loading,
			storiesLoading: state.stories.op,
			total: state.stories.total,
		}),
		shallowEqual
	);

	const {data} = loggedUser;

	const follower =
		followers && followers.length && followers.find(item => item.follower.id === data.id);

	const handleFollow = () => {
		dispatch(createOrDeleteFollower(follower, id, data && data.id));
	};

	const {display_name, username, description} = user;
	const label = follower ? 'Unfollow' : 'Follow';

	const info = (
		<>
			<div className={className + '-user-info-stats'}>
				<div className={className + '-user-info-stats-stories'}>
					<span>{total}</span>
					<span>Stories</span>
				</div>
				<Followers id={id} />
				<FollowedBy id={id} />
			</div>
			{data && Number(id) !== data.id && (
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

	return (
		<div className={className + '-user'}>
			<UserAvatar user={user} />
			<div className={className + '-user-info'}>
				<div className={className + '-user-info-description'}>
					<span>{display_name || username}</span>
					<span>{description}</span>
				</div>

				{storiesLoading ? <Loader /> : info}
			</div>
		</div>
	);
}
