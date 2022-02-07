import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import './NoItemsPlaceholder.scss';

const CLASS = 'st-NoItemsPlaceholder';

function NoItemsPlaceholder({
	buttonProps,
	title,
	titleProps,
	subtitle,
	subtitleProps,
	className,
	withBackground,
	withBorder,
	buttonText,
}) {
	return (
		<div
			className={classNames(
				CLASS,
				withBackground && CLASS + '-background__primary',
				withBorder && CLASS + '-border',
				className
			)}
		>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.h4}
				component={TYPOGRAPHY_VARIANTS.h4}
				fontWeight={FONT_WEIGHT.bold}
				font={FONTS.merri}
				{...titleProps}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography
					variant={TYPOGRAPHY_VARIANTS.action1}
					color={TEXT_COLORS.secondary}
					{...subtitleProps}
				>
					{subtitle}
				</Typography>
			)}
			{buttonText && <IconButton {...buttonProps}>{buttonText}</IconButton>}
		</div>
	);
}

NoItemsPlaceholder.defaultProps = {
	buttonProps: {},
	titleProps: {},
	subtitleProps: {},
};

NoItemsPlaceholder.propTypes = {
	buttonProps: PropTypes.object,
	buttonText: PropTypes.string,
	title: PropTypes.string,
	withBackground: PropTypes.bool,
	withBorder: PropTypes.bool,
	subtitle: PropTypes.string,
	className: PropTypes.string,
	titleProps: PropTypes.object,
	subtitleProps: PropTypes.object,
};

export default NoItemsPlaceholder;
