import React from 'react';
import propTypes from 'prop-types';

import Image from '../image/Image';

import background from 'images/cover.png';

import './Billboard.scss';

const CLASS = 'st-Billboard';

export default function Billboard(props) {
	const {text, src} = props;
	return (
		<div className={CLASS}>
			<Image src={src} alt="background" />
			<h1>{text}</h1>
		</div>
	);
}

Billboard.propTypes = {
	text: propTypes.string,
	src: propTypes.string,
};

Billboard.defaultProps = {
	src: background,
};
