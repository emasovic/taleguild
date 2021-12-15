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
	title,
	subtitle,
	to,
	buttonLabel,
	className,
	buttonProps,
}) {
	return (
		<div className={classNames(CLASS, className)}>
			{IconComponent && <IconComponent />}

			<Typography
				font={FONTS.merri}
				variant={TYPOGRAPHY_VARIANTS.h1}
				fontWeight={FONT_WEIGHT.bold}
			>
				{title}
			</Typography>
			<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
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
	IconComponent: PropTypes.object,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	buttonLabel: PropTypes.string,
	to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	className: PropTypes.string,
	buttonProps: PropTypes.object,
};

PagePlaceholder.defaultProps = {
	buttonProps: {},
};

export default PagePlaceholder;
