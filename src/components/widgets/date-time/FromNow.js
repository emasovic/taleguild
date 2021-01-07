import React from 'react';
import propTypes from 'prop-types';
import moment from 'moment';

export default function FromNow({date}) {
	if (!date) {
		return null;
	}
	return <span>{moment(date).fromNow()}</span>;
}

FromNow.propTypes = {
	date: propTypes.string,
};
