import React from 'react';
import PropTypes from 'prop-types';
import {Link as Rlink} from 'react-router-dom';
import classNames from 'classnames';

import './Link.scss';

const CLASS = 'st-Link';

export const UNDERLINE = {
	always: 'always',
	hover: 'hover',
	none: 'none',
};

const UNDERLINE_CLASSES = {
	always: '',
	hover: `${CLASS}-underline_hover`,
	none: `${CLASS}-underline_none`,
};

function Link({to, underline, children, className, ...rest}) {
	return (
		<Rlink
			to={to}
			className={classNames(CLASS, UNDERLINE_CLASSES[underline], className)}
			{...rest}
		>
			{children}
		</Rlink>
	);
}

Link.defaultProps = {
	underline: UNDERLINE.always,
};

Link.propTypes = {
	to: PropTypes.string.isRequired,
	underline: PropTypes.string,
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Link;
