import React, {useRef, useEffect, useState} from 'react';
import propTypes from 'prop-types';

import {ICONS, ICON_COMPONENTS} from 'types/icons';

import './Icon.scss';

const CLASS = 'st-Icon';

export default function Icon({icon, size}) {
	const [iconSize, setIconSize] = useState(0);
	const iconRef = useRef();

	const setIconDimension = size => {
		const {current} = iconRef;
		const width = current && current.offsetWidth;
		const height = current && current.offsetHeight;
		const calculatedSize = width >= height ? width / 10 : height / 10;
		const iconSize = size || Math.ceil(calculatedSize / 10) * 22;

		setIconSize(iconSize);
	};

	useEffect(() => {
		setIconDimension(size);
	}, [icon, size]);

	const Icon = ICON_COMPONENTS[icon];

	return (
		<div ref={iconRef} className={CLASS}>
			<Icon width={iconSize} height={iconSize} />
		</div>
	);
}

Icon.propTypes = {
	icon: propTypes.string,
	size: propTypes.number,
};

Icon.defaultProps = {
	icon: ICONS.logo_grey,
};
