import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_CRITERIA} from 'types/story';

import {loadUser, selectUserByUsername} from 'redux/users';
import {newStory, selectStories} from 'redux/story';
import {selectAuthUser} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';

import NoItemsPlaceholder from 'views/dashboard/widgets/NoItemsPlaceholder';
import Stories from 'views/stories/Stories';
import NoStories from 'views/stories/NoStories';

import UserProfileInfo from './UserProfileInfo';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const {username} = useParams();
	const dispatch = useDispatch();

	const user = useSelector(state => selectUserByUsername(state, username));
	const stories = useSelector(selectStories);
	const {data} = useSelector(selectAuthUser);

	const isOwnProfile = data?.id === user?.id;

	const component = isOwnProfile ? (
		<NoItemsPlaceholder
			title="Write your first story"
			subtitle="Start writing your first story with our simple and clean text editor"
			buttonText="Write story now"
			buttonProps={{onClick: () => dispatch(newStory({user: data?.id, published_at: null}))}}
			withBackground
		/>
	) : (
		<NoStories />
	);

	useEffect(() => {
		dispatch(loadUser(username));
	}, [dispatch, username]);

	if (!user) {
		return <Loader />;
	}
	return (
		<div className={CLASS}>
			<UserProfileInfo user={user} className={CLASS} />
			<Stories
				criteria={{...DEFAULT_CRITERIA, user: user?.id}}
				NoItemsComponent={component}
				displaySearch={!!stories?.length}
				displayNav={!!stories?.length}
			/>
		</div>
	);
}
