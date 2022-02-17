import React from 'react';
import PropTypes from 'prop-types';

import {TEXT_COLORS} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';

const countWords = content => {
	let count = 0;
	content.forEach(value => {
		let s = value['children'][0]['text'];
		if (s.length !== 0 && s.match(/\b[-?(\w+)?]+\b/gi)) {
			s = s.replace(/(^\s*)|(\s*$)/gi, '');
			s = s.replace(/[ ]{2,}/gi, ' ');
			s = s.replace(/\n /, '\n');
			count += s.split(' ').length;
		}
	});
	return count;
};

const countChars = content => {
	let count = content.length > 1 ? content.length - 1 : 0;
	content.forEach(value => {
		count += value['children'][0]['text'].length;
	});
	return count;
};

function Counter({value}) {
	const words = countWords(value);
	const chars = countChars(value);
	return (
		<Typography color={TEXT_COLORS.secondary}>
			{words} words / {chars} characters
		</Typography>
	);
}

Counter.propTypes = {
	value: PropTypes.array.isRequired,
};

export default Counter;
