import React from 'react';
import PropTypes from 'react';

const Menu = React.forwardRef(({className, children, ...props}, ref) => (
	<div className={className} ref={ref} {...props}>
		{children}
	</div>
));

Menu.displayName = 'Menu';

Menu.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
};

export default Menu;
