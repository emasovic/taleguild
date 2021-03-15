import React from 'react';
import {Badge} from 'reactstrap';
import propTypes from 'prop-types';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';

import './UserAvatar.scss';

const CLASS = 'st-UserAvatar';

export default function UserAvatar({user, onClick}) {
	if (!user) {
		return null;
	}
	const {avatar, username} = user;

	return (
		<div className={CLASS} onClick={onClick}>
			{avatar ? (
				<Image
					image={avatar}
					formats={avatar && avatar.formats}
					size={MEDIA_SIZE.thumbnail}
				/>
			) : (
				<Badge>{username && username.slice(0, 1)}</Badge>
			)}
		</div>
	);
}

UserAvatar.propTypes = {
	user: propTypes.object,
	onClick: propTypes.func,
};
