import React from 'react';
import {useHistory, Link} from 'react-router-dom';

import propTypes from 'prop-types';

import {goToStory, goToUser} from 'lib/routes';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';
import StoryDropdownButton from './widgets/dropdown-button/StoryDropdownButton';
import FromNow from 'components/widgets/date-time/FromNow';

import UserAvatar from 'views/user/UserAvatar';

import './StoryThumb.scss';

const CLASS = 'st-StoryThumb';

export default function StoryThumb({
	id,
	image,
	formats,
	size,
	// description,
	title,
	author,
	createdDate,
	favouriteId,
	onDeleteStory,
	storypages,
	slug,
}) {
	const history = useHistory();

	const handleGoToUser = e => {
		e.preventDefault();
		history.push(goToUser(author && author.username));
	};
	title = title && title.length > 36 ? title.slice(0, 36) + '...' : title;
	image = image ? image.formats.thumbnail : image;

	return (
		<div className={CLASS}>
			<StoryDropdownButton
				story={{id, favouriteId, title, storypages}}
				onDeleteStory={onDeleteStory}
			/>
			<Link to={goToStory(slug)} className={CLASS}>
				<div className={CLASS + '-cover'}>
					<Image image={image} formats={formats} size={size} />
				</div>
				<div className={CLASS + '-details'}>
					<div className={CLASS + '-details-description'}>
						<span>{title}</span>
						{/* <span>{description}</span> */}
					</div>

					<div className={CLASS + '-details-created'}>
						<FromNow date={createdDate} />
						{author && (
							<div onClick={handleGoToUser}>
								<UserAvatar user={author} />
							</div>
						)}
					</div>
				</div>
			</Link>
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
	favouriteId: propTypes.number,
	onDeleteStory: propTypes.func,
	slug: propTypes.string,
};

StoryThumb.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};
