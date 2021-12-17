import React, {forwardRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './MobileWrapper.scss';

const CLASS = 'st-MobileWrapper';

const MobileWrapper = forwardRef(({children, className, ...rest}, ref) => {
	return (
		<div className={classNames(CLASS, className)} {...rest} ref={ref}>
			{children}
		</div>
	);
});

MobileWrapper.displayName = 'MobileWrapper';

MobileWrapper.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

export default MobileWrapper;
