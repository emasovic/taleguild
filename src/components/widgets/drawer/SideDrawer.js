import React from 'react';
import propTypes from 'prop-types';

import './SideDrawer.scss';

const CLASS = 'st-SideDrawer';

export default function SideDrawer({isOpen, children}) {
	const className = isOpen ? `${CLASS} open` : CLASS;
	return <div className={className}>{children}</div>;
}

SideDrawer.propTypes = {
	isOpen: propTypes.bool,
};
