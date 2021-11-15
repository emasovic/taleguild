import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MobileWrapper.scss';

const CLASS = 'st-MobileWrapper';

function MobileWrapper({children, className}) {
	return <div className={classNames(CLASS, className)}>{children}</div>;
}

MobileWrapper.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

export default MobileWrapper;
