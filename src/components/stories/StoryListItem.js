import React from 'react';
import propTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {goToStory} from 'lib/routes';

import {MEDIA_SIZE} from 'types/media';

import Image from 'components/widgets/image/Image';

import './StoryListItem.scss';

const CLASS = 'st-StoryListItem';

export default function StoryListItem({id, formats, size, image, title}) {
	return (
		<div className={CLASS}>
			<Link to={goToStory(id)} className={CLASS + '-cover'}>
				<Image image={image} formats={formats} size={size} />
			</Link>
			<div className={CLASS + '-description'}>
				<span>{title}</span>
			</div>
		</div>
	);
}

StoryListItem.propTypes = {
	id: propTypes.number,
	image: propTypes.object,
	formats: propTypes.object,
	size: propTypes.string,
	title: propTypes.string,
};

StoryListItem.defaultProps = {
	size: MEDIA_SIZE.thumbnail,
};