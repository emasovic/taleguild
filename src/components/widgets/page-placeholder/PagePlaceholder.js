import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import Typography from '../typography/Typography';
import IconButton from '../button/IconButton';

import './PagePlaceholder.scss';

const CLASS = 'st-PagePlaceholder';

function PagePlaceholder({
	IconComponent,
	iconComponentProps,
	title,
	titleProps,
	subtitle,
	subtitleProps,
	to,
	buttonLabel,
	className,
	buttonProps,
}) {
	return (
		<div className={classNames(CLASS, className)}>
			{IconComponent && <IconComponent {...iconComponentProps} />}

			<Typography
				font={FONTS.merri}
				variant={TYPOGRAPHY_VARIANTS.h1}
				fontWeight={FONT_WEIGHT.bold}
				{...titleProps}
			>
				{title}
			</Typography>
			<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1} {...subtitleProps}>
				{subtitle}
			</Typography>

			{buttonLabel && (
				<IconButton tag={Link} to={to} {...buttonProps}>
					{buttonLabel}
				</IconButton>
			)}
		</div>
	);
}

PagePlaceholder.propTypes = {
	IconComponent: PropTypes.func,
	iconComponentProps: PropTypes.object,
	title: PropTypes.string.isRequired,
	titleProps: PropTypes.object,
	subtitle: PropTypes.string.isRequired,
	subtitleProps: PropTypes.object,
	buttonLabel: PropTypes.string,
	to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

PagePlaceholder.defaultProps = {
	buttonProps: {},
	subtitleProps: {},
	titleProps: {},
	iconComponentProps: {},
};

export default PagePlaceholder;
