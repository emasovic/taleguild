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
	title,
	author,
	createdDate,
	onDeleteStory,
	slug,
	selector,
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
			<StoryDropdownButton id={id} onDeleteStory={onDeleteStory} selector={selector} />
			<Link
				to={goToStory(slug)}
				underline={UNDERLINE.none}
				className={CLASS + '-link-wrapper'}
			>
				<div className={CLASS + '-cover'}>
					<Image image={image} formats={formats} size={size} />
				</div>
				<div className={CLASS + '-details'}>
					<div className={CLASS + '-details-description'}>
						<span>{title}</span>
					</div>

					<div className={CLASS + '-details-created'}>
						<div>
							<FromNow date={createdDate} />
						</div>
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
	title: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
	onDeleteStory: propTypes.func,
	slug: propTypes.string,
	selector: propTypes.func,
};

StoryThumb.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};
