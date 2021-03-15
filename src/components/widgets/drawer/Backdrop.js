import React from 'react';
import propTypes from 'prop-types';

import './Backdrop.scss';

const CLASS = 'st-Backdrop';

export default function Backdrop({onClick}) {
	return <div onClick={onClick} className={CLASS} />;
}

Backdrop.propTypes = {
	onClick: propTypes.func,
};
