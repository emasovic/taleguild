import React from 'react';
import {Badge} from 'reactstrap';
import propTypes from 'prop-types';

import Image from 'components/widgets/image/Image';

import './UserAvatar.scss';

const CLASS = 'st-UserAvatar';

export default function UserAvatar({user}) {
	if (!user) {
		return null;
	}
	const {avatar, username} = user;
	const {formats} = avatar;
	return (
		<div className={CLASS}>
			{avatar ? (
				<Image image={formats.thumbnail} />
			) : (
				<Badge>{username && username.slice(0, 1)}</Badge>
			)}
		</div>
	);
}

UserAvatar.propTypes = {
	user: propTypes.object,
};
