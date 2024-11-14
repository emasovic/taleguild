import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import {DEFAULT_CRITERIA} from 'types/story';
import {COLOR} from 'types/button';

import {loadUser, selectUserByUsername} from 'redux/users';
import {selectStories} from 'redux/story';
import {selectAuthUser} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';
import Link from 'components/widgets/link/Link';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

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

	const component = isOwnProfile ? NoItemsPlaceholder : NoStories;

	const componentProps = isOwnProfile
		? {
				title: 'You have no published stories.',
				subtitle:
					'You can make your stories public and it will be visible here on your profile and in the Community. If you want to publish a story, choose from Drafts.',
				buttonText: 'Visit Drafts',
				buttonProps: {to: USER_STORIES_DRAFTS, tag: Link, color: COLOR.secondary},
		  }
		: {};

	useEffect(() => {
		dispatch(loadUser(username));
	}, [dispatch, username]);

	if (!user) return <Loader />;

	DEFAULT_CRITERIA.filters.user = user?.id;

	return (
		<MobileWrapper className={CLASS}>
			<UserProfileInfo user={user} className={CLASS} />
			<Stories
				criteria={DEFAULT_CRITERIA}
				NoItemsComponent={component}
				noItemsComponentProps={componentProps}
				displaySearch={!!stories?.length}
				displayNav={!!stories?.length}
			/>
		</MobileWrapper>
	);
}
