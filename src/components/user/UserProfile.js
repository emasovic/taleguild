import React from 'react';

import {useParams} from 'react-router-dom';

import {DEFAULT_CRITERIA} from 'types/story';

import Stories from 'components/stories/Stories';

import UserProfileInfo from './UserProfileInfo';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const {id} = useParams();
	return (
		<div className={CLASS}>
			<UserProfileInfo userId={id} className={CLASS} />
			<Stories criteria={{...DEFAULT_CRITERIA, user: id}} />
		</div>
	);
}
