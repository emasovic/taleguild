import React from 'react';
import {useHistory, Link} from 'react-router-dom';
import moment from 'moment';

import {goToStory, goToUser} from 'lib/routes';

import Image from 'components/widgets/image/Image';
import UserAvatar from 'components/user/UserAvatar';

import './StoryThumb.scss';

const CLASS = 'st-StoryThumb';

export default function StoryThumb({id, image, description, title, author, createdDate}) {
	const history = useHistory();

	const handleGoToUser = e => {
		e.preventDefault();
		history.push(goToUser(author && author.id));
	};
	description = description && description.length > 66 ? description.slice(0, 66) + '...' : description;
	return (
		<Link to={goToStory(id)} className={CLASS}>
			<div className={CLASS + '-cover'}>
				<Image image={image} />
			</div>
			<div className={CLASS + '-details'}>
				<div className={CLASS + '-details-description'}>
					<span>{title}</span>
					<span>{description}</span>
				</div>

				<div className={CLASS + '-details-created'}>
					<span>{moment(createdDate).fromNow()}</span>
					{author && (
						<div onClick={handleGoToUser}>
							<UserAvatar user={author} />
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
