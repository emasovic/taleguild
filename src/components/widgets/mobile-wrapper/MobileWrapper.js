import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MobileWrapper.scss';

const CLASS = 'st-MobileWrapper';

function MobileWrapper({children, className, ...rest}) {
	return (
		<div className={classNames(CLASS, className)} {...rest}>
			{children}
		</div>
	);
}

MobileWrapper.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

export default MobileWrapper;
