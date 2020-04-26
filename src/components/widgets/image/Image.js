import React from 'react';
import PropTypes from 'prop-types';
// import {ColorExtractor} from 'react-color-extractor';

import './Image.scss';

const CLASS = 'st-Image';

export default function Image(props) {
	if (!props.src) {
		return <div className={CLASS + '-fallback'} />;
	}
	return <img {...props} alt={props.alt} className={CLASS} />;
}

Image.propTypes = {
	imageId: PropTypes.number,
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
