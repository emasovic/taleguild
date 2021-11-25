import React from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {COLOR} from 'types/button';

import {selectAuthUser} from 'redux/auth';
import {selectFollowers, createOrDeleteFollower} from 'redux/followers';

import IconButton from 'components/widgets/button/IconButton';
import Helmet from 'components/widgets/helmet/Helmet';

import Followers from './followers/Followers';
import FollowedBy from './followers/Following';

import UserAvatar from './UserAvatar';

export default function UserProfileInfo({user, className}) {
	const dispatch = useDispatch();

	const {total, followers, followersLoading, loggedUser} = useSelector(state => {
		const loggedUser = selectAuthUser(state);
		return {
			followers: selectFollowers(state, user?.id),
			loggedUser: loggedUser?.data,
			followersLoading: state.followers.loading,
			total: state.stories.total,
		};
	}, shallowEqual);

	let follower = null;

	const {display_name, username, description, id} = user;

	if (loggedUser) {
		follower =
			followers &&
			followers.length &&
			followers.find(item => item.follower.id === loggedUser.id);
	}

	const handleFollow = () => {
		dispatch(createOrDeleteFollower(follower, id, loggedUser?.id));
	};

	const label = follower ? 'Unfollow' : 'Follow';
	const displayName = display_name || username;

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
			{loggedUser && Number(id) !== loggedUser.id && (
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
			<Helmet title={displayName} description={description} />
			<UserAvatar user={user} />
			<div className={className + '-user-info'}>
				<div className={className + '-user-info-description'}>
					<span>{displayName}</span>
					<span>{description}</span>
				</div>

				{info}
			</div>
		</div>
	);
}

UserProfileInfo.propTypes = {
	user: PropTypes.object,
	className: PropTypes.string,
};
