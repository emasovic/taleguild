import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../icon/Icon';

import './Image.scss';

const CLASS = 'st-Image';

export default function Image({src, image, alt, formats, size, ...rest}) {
	if (formats && formats[size]) {
		image = formats[size];
	}

	if (image) {
		src = process.env.REACT_APP_API_URL + image.url;
	}

	if (!src) {
		return (
			<div className={CLASS + '-fallback'}>
				<Icon />
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
	formats: PropTypes.object,
	size: PropTypes.string,
};

Image.defaultProps = {
	src: '',
	alt: 'image',
};
