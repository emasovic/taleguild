import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {FONTS, TYPOGRAPHY_LATO, TYPOGRAPHY_MERRI, TYPOGRAPHY_VARIANTS} from 'types/typography';

const VARIANTS = {
	[FONTS.lato]: {
		p14: TYPOGRAPHY_LATO.placeholder_grey_medium,
	},
	[FONTS.merri]: {
		h1: TYPOGRAPHY_MERRI.heading_h1_black_bold,
		h2: TYPOGRAPHY_MERRI.heading_h2_black_bold,
		h3: TYPOGRAPHY_MERRI.heading_h3_black_bold,
		h4: TYPOGRAPHY_MERRI.heading_h4_black_bold,
		p18: TYPOGRAPHY_MERRI.placeholder_18_black,
		p16: TYPOGRAPHY_MERRI.placeholder_16_black,
	},
};

function Typography({variant, font, component, className, children}) {
	const Component = component;
	return (
		<Component className={classNames(VARIANTS[font][variant], className)}>{children}</Component>
	);
}

Typography.defaultProps = {
	component: 'span',
	variant: TYPOGRAPHY_VARIANTS.p14,
	font: FONTS.lato,
};

Typography.propTypes = {
	variant: PropTypes.string.isRequired,
	font: PropTypes.string.isRequired,
	component: PropTypes.element,
	className: PropTypes.string,
	children: PropTypes.any,
};

export default Typography;
