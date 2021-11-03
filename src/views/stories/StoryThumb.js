import React from 'react';
import {useHistory} from 'react-router-dom';

import propTypes from 'prop-types';

import {goToStory, goToUser} from 'lib/routes';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';
import StoryDropdownButton from './widgets/dropdown-button/StoryDropdownButton';
import FromNow from 'components/widgets/date-time/FromNow';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from 'views/user/UserAvatar';

import './StoryThumb.scss';

const CLASS = 'st-StoryThumb';

export default function StoryThumb({
	id,
	image,
	formats,
	size,
	archivedAt,
	title,
	author,
	createdDate,
	favouriteId,
	onDeleteStory,
	storypages,
	slug,
	displayArchived,
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
				story={{id, favouriteId, title, storypages, archivedAt, publishedAt: createdDate}}
				onDeleteStory={onDeleteStory}
				displayArchived={displayArchived}
			/>
			<Link to={goToStory(slug)} underline={UNDERLINE.none} className={CLASS}>
				<div className={CLASS + '-cover'}>
					<Image image={image} formats={formats} size={size} />
				</div>
				<div className={CLASS + '-details'}>
					<div className={CLASS + '-details-description'}>
						<span>{title}</span>
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
	archivedAt: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
	storypages: propTypes.array,
	favouriteId: propTypes.number,
	onDeleteStory: propTypes.func,
	slug: propTypes.string,
	displayArchived: propTypes.bool,
};

StoryThumb.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};
