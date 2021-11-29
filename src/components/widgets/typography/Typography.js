import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_CURSORS,
	TEXT_TRASFORM,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';

import './Typography.scss';

const CLASS = 'st-Typography';

const FONT_CLASSES = {
	[FONTS.merri]: `${CLASS}-merriweather`,
	[FONTS.lato]: undefined,
};

const FONT_WEIGHT_CLASSES = {
	[FONT_WEIGHT.bold]: `${CLASS}-bold`,
	[FONT_WEIGHT.semiBold]: `${CLASS}-semi-bold`,
};

const TEXT_TRANSFORM_CLASSES = {
	[TEXT_TRASFORM.capitalize]: `${CLASS}-capitalize`,
	[TEXT_TRASFORM.uppercase]: `${CLASS}-uppercase`,
	[TEXT_TRASFORM.lowercase]: `${CLASS}-lowercase`,
};

const VARIANT_CLASSES = {
	[TYPOGRAPHY_VARIANTS.h1]: `${CLASS}-h1`,
	[TYPOGRAPHY_VARIANTS.h2]: `${CLASS}-h2`,
	[TYPOGRAPHY_VARIANTS.h3]: `${CLASS}-h3`,
	[TYPOGRAPHY_VARIANTS.h4]: `${CLASS}-h4`,
	[TYPOGRAPHY_VARIANTS.action1]: `${CLASS}-action1`,
};

const COLOR_CLASSES = {
	[TEXT_COLORS.primary]: `${CLASS}-primary`,
	[TEXT_COLORS.secondary]: `${CLASS}-secondary`,
	[TEXT_COLORS.tertiary]: `${CLASS}-tertiary`,
	[TEXT_COLORS.buttonPrimary]: `${CLASS}-primary_button`,
};

const CURSOR_CLASSES = {
	[TEXT_CURSORS.pointer]: `${CLASS}-pointer`,
	[TEXT_CURSORS.disabled]: `${CLASS}-disabled`,
};

function Typography({
	variant,
	font,
	color,
	fontWeight,
	textTransform,
	component,
	className,
	children,
	cursor,
	disabled,
	...rest
}) {
	const Component = component;
	const tClassName = classNames(
		font && FONT_CLASSES[font],
		fontWeight && FONT_WEIGHT_CLASSES[fontWeight],
		textTransform && TEXT_TRANSFORM_CLASSES[textTransform],
		variant && VARIANT_CLASSES[variant],
		color && COLOR_CLASSES[color],
		cursor && CURSOR_CLASSES[cursor],
		disabled && CURSOR_CLASSES[TEXT_CURSORS.disabled],
		className
	);
	return (
		<Component className={tClassName} {...rest}>
			{children}
		</Component>
	);
}

Typography.defaultProps = {
	component: 'span',
	variant: TYPOGRAPHY_VARIANTS.action1,
	color: TEXT_COLORS.primary,
	cursor: TEXT_CURSORS.default,
	font: FONTS.lato,
};

Typography.propTypes = {
	component: PropTypes.any,
	className: PropTypes.string,
	children: PropTypes.any,
	cursor: PropTypes.string,
	color: PropTypes.string,
	disabled: PropTypes.bool,
	font: PropTypes.string.isRequired,
	fontWeight: PropTypes.string,
	textTransform: PropTypes.string,
	variant: PropTypes.string.isRequired,
};

export default Typography;
