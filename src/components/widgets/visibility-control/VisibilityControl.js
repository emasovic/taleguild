import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './VisibilityControl.scss';

const CLASS = 'st-VisibilityControl';

function VisibilityControl({visible, className, children}) {
	const visibilityClass = visible ? CLASS + '-visible' : CLASS + '-hidden';
	return <div className={classNames(visibilityClass, className)}>{children}</div>;
}

VisibilityControl.propTypes = {
	visible: PropTypes.bool.isRequired,
	className: PropTypes.string,
	children: PropTypes.any,
};

export default VisibilityControl;
