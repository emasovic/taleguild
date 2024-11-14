import React from 'react';
import propTypes from 'prop-types';
import {Spinner} from 'reactstrap';
import classNames from 'classnames';

import {COLOR} from 'types/button';

import './Loader.scss';

const CLASS = 'st-Loader';

export default function Loader({className}) {
	return (
		<div className={classNames(CLASS, className)}>
			<Spinner color={COLOR.primary} />
		</div>
	);
}

Loader.propTypes = {
	className: propTypes.string,
};
