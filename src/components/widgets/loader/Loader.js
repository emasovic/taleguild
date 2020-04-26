import React, {useState, useRef, useEffect} from 'react';
import propTypes from 'prop-types';

import Image from '../image/Image';

import logo from 'images/logo.svg';

import './Loader.scss';

const CLASS = 'st-Loader';

export default function Loader({icon}) {
	const [spinnerSize, setSpinnerSize] = useState(0);
	const loaderRef = useRef();

	const setSpinnerDimension = icon => {
		const {current} = loaderRef;
		const width = current && current.offsetWidth;
		const height = current && current.offsetHeight;
		const size = width >= height ? width / 10 : height / 10;
		const spinnerSize = Math.ceil(size / 10) * 5;

		setSpinnerSize(spinnerSize);
	};

	useEffect(() => {
		setSpinnerDimension(icon);
	}, [icon]);

	return (
		<div ref={loaderRef} className={CLASS}>
			<Image src={icon} height={spinnerSize} width={spinnerSize} />
		</div>
	);
}

Loader.propTypes = {
	icon: propTypes.string,
};

Loader.defaultProps = {
	icon: logo,
};
