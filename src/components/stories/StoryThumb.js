import React from 'react';
import {useHistory, Link} from 'react-router-dom';
import moment from 'moment';
import propTypes from 'prop-types';

import {goToStory, goToUser} from 'lib/routes';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';
import StoryDropdownButton from './widgets/StoryDropdownButton';
import UserAvatar from 'components/user/UserAvatar';

import './StoryThumb.scss';

const CLASS = 'st-StoryThumb';

export default function StoryThumb({
	id,
	image,
	formats,
	size,
	description,
	title,
	author,
	createdDate,
	favouriteId,
	onDeleteStory,
	storypages,
}) {
	const history = useHistory();

	const handleGoToUser = e => {
		e.preventDefault();
		history.push(goToUser(author && author.id));
	};
	description =
		description && description.length > 66 ? description.slice(0, 66) + '...' : description;
	image = image ? image.formats.thumbnail : image;

	return (
		<div className={CLASS}>
			<StoryDropdownButton
				story={{id, favouriteId, title, storypages}}
				onDeleteStory={onDeleteStory}
			/>
			<Link to={goToStory(id)} className={CLASS + '-cover'}>
				<Image image={image} formats={formats} size={size} />
			</Link>
			<div className={CLASS + '-details'}>
				<div className={CLASS + '-details-description'}>
					<span>{title}</span>
					{/* <span>{description}</span> */}
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
		</div>
	);
}

StoryThumb.propTypes = {
	id: propTypes.number,
	image: propTypes.object,
	formats: propTypes.object,
	size: propTypes.string,
	description: propTypes.string,
	title: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
	storypages: propTypes.array,
};

StoryThumb.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};
