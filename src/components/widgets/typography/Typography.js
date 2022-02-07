import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_CURSORS,
	TEXT_TRASFORM,
	TEXT_WRAP,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';

import './Typography.scss';

const CLASS = 'st-Typography';

const FONT_CLASSES = {
	[FONTS.merri]: `${CLASS}-font__merriweather`,
	[FONTS.lato]: undefined,
};

const FONT_WEIGHT_CLASSES = {
	[FONT_WEIGHT.bold]: `${CLASS}-weight__bold`,
	[FONT_WEIGHT.semiBold]: `${CLASS}-weight__semi-bold`,
	[FONT_WEIGHT.normal]: `${CLASS}-weight__normal`,
};

const TEXT_TRANSFORM_CLASSES = {
	[TEXT_TRASFORM.capitalize]: `${CLASS}-transform__capitalize`,
	[TEXT_TRASFORM.uppercase]: `${CLASS}-transform__uppercase`,
	[TEXT_TRASFORM.lowercase]: `${CLASS}-transform__lowercase`,
};

const VARIANT_CLASSES = {
	[TYPOGRAPHY_VARIANTS.h1]: `${CLASS}-variant__h1`,
	[TYPOGRAPHY_VARIANTS.h2]: `${CLASS}-variant__h2`,
	[TYPOGRAPHY_VARIANTS.h3]: `${CLASS}-variant__h3`,
	[TYPOGRAPHY_VARIANTS.h4]: `${CLASS}-variant__h4`,
	[TYPOGRAPHY_VARIANTS.action1]: `${CLASS}-variant__action1`,
};

const COLOR_CLASSES = {
	[TEXT_COLORS.primary]: `${CLASS}-color__primary`,
	[TEXT_COLORS.secondary]: `${CLASS}-color__secondary`,
	[TEXT_COLORS.tertiary]: `${CLASS}-color__tertiary`,
	[TEXT_COLORS.buttonPrimary]: `${CLASS}-color__primary_button`,
};

const CURSOR_CLASSES = {
	[TEXT_CURSORS.pointer]: `${CLASS}-cursor__pointer`,
	[TEXT_CURSORS.disabled]: `${CLASS}-cursor__disabled`,
};

const WRAP_CLASSES = {
	[TEXT_WRAP.break]: `${CLASS}-wrap__break`,
	[TEXT_WRAP.normal]: `${CLASS}-wrap__normal`,
	[TEXT_WRAP.ellipsis]: `${CLASS}-wrap__ellipsis`,
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
	wrap,
	disabled,
	...rest
}) {
	const Component = component;
	const tClassName = classNames(
		font && FONT_CLASSES[font],
		textTransform && TEXT_TRANSFORM_CLASSES[textTransform],
		variant && VARIANT_CLASSES[variant],
		fontWeight && FONT_WEIGHT_CLASSES[fontWeight],
		color && COLOR_CLASSES[color],
		cursor && CURSOR_CLASSES[cursor],
		disabled && CURSOR_CLASSES[TEXT_CURSORS.disabled],
		wrap && WRAP_CLASSES[wrap],
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
	wrap: TEXT_WRAP.break,
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
	wrap: PropTypes.string,
};

export default Typography;
