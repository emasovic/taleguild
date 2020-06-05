import React from 'react';

const Menu = React.forwardRef(({className, children, ...props}, ref) => (
	<div className={className} ref={ref} {...props}>
		{children}
	</div>
));

Menu.displayName = 'Menu';

export default Menu;
