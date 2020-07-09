import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';

import {ICONS, ICON_COMPONENTS} from 'types/icons';

import './Icon.scss';

const CLASS = 'st-Icon';

export default function Icon({icon}) {
	const [iconSize, setIconSize] = useState(0);
	const iconRef = useRef();

	const setIconDimension = () => {
		const {current} = iconRef;
		const width = current && current.offsetWidth;
		const height = current && current.offsetHeight;
		const size = width >= height ? width / 10 : height / 10;
		const iconSize = Math.ceil(size / 10) * 10;

		setIconSize(iconSize);
	};

	useEffect(() => {
		setIconDimension();
	}, [icon]);

	const Icon = ICON_COMPONENTS[icon];

	return (
		<div ref={iconRef} className={CLASS}>
			<Icon width={iconSize} height={iconSize} />
		</div>
	);
}

Icon.propTypes = {
	icon: propTypes.string,
};

Icon.defaultProps = {
	icon: ICONS.logo_grey,
};
