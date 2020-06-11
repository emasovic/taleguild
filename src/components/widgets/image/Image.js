import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import ENV from 'env';

import FA from 'types/font_awesome';

import './Image.scss';

const CLASS = 'st-Image';

export default function Image({src, image, alt, ...rest}) {
	if (image) {
		src = ENV.api.url + image.url;
	}

	if (!src) {
		return (
			<div className={CLASS + '-fallback'}>
				<FontAwesomeIcon icon={FA.solid_image} />
			</div>
		);
	}

	return <img src={src} alt={alt} className={CLASS} {...rest} />;
}

Image.propTypes = {
	image: PropTypes.object,
	src: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	alt: PropTypes.string,
	getColors: PropTypes.func,
};

Image.defaultProps = {
	src: '',
	alt: 'image',
};
