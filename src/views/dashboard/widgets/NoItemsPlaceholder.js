import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import './NoItemsPlaceholder.scss';

const CLASS = 'st-NoItemsPlaceholder';

function NoItemsPlaceholder({buttonProps, title, subtitle, className, buttonText}) {
	return (
		<div className={classNames(CLASS, className)}>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.h4}
				component={TYPOGRAPHY_VARIANTS.h4}
				font={FONTS.merri}
			>
				{title}
			</Typography>
			{subtitle && (
				<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
					{subtitle}
				</Typography>
			)}
			<IconButton {...buttonProps}>{buttonText}</IconButton>
		</div>
	);
}

NoItemsPlaceholder.defaultProps = {
	buttonProps: {},
};

NoItemsPlaceholder.propTypes = {
	buttonProps: PropTypes.object,
	buttonText: PropTypes.string,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	className: PropTypes.string,
};

export default NoItemsPlaceholder;
