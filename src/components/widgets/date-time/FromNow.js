import React from 'react';
import propTypes from 'prop-types';
import {formatDistance} from 'date-fns';

export default function FromNow({date}) {
	if (!date) {
		return null;
	}
	return <span>{formatDistance(new Date(date), new Date(), {addSuffix: true})}</span>;
}

FromNow.propTypes = {
	date: propTypes.string,
};
