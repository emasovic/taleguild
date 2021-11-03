import React from 'react';
import propTypes from 'prop-types';

import {goToStory} from 'lib/routes';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import './StoryListItem.scss';

const CLASS = 'st-StoryListItem';

export default function StoryListItem({formats, size, image, slug, title}) {
	title = title && title.length > 36 ? title.slice(0, 36) + '...' : title;
	return (
		<Link to={goToStory(slug)} underline={UNDERLINE.none} className={CLASS}>
			<div className={CLASS + '-cover'}>
				<Image image={image} formats={formats} size={size} />
			</div>
			<div className={CLASS + '-description'}>
				<span>{title}</span>
			</div>
		</Link>
	);
}

StoryListItem.propTypes = {
	id: propTypes.number,
	image: propTypes.object,
	formats: propTypes.object,
	size: propTypes.string,
	title: propTypes.string,
	slug: propTypes.string,
};

StoryListItem.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};
