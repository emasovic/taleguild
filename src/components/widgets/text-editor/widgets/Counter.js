import React from 'react';
import PropTypes from 'prop-types';

import {TEXT_COLORS} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';

const countWords = content => {
	let count = 0;
	content.forEach(value => {
		value.children.forEach(t => {
			let text = t.text.replace(/(^\s*)|(\s*$)/gi, '');
			text = text.replace(/[ ]{2,}/gi, ' ');
			text = text.replace(/\n /, '\n');
			count += text.split(' ').length;
		});
	});
	return count;
};

const countChars = content => {
	let count = content.length > 1 ? content.length - 1 : 0;
	content.forEach(value => {
		value.children.forEach(t => {
			count += t.text.length;
		});
	});
	return count;
};

function Counter({value}) {
	const words = countWords(value);
	const chars = countChars(value);
	return (
		<Typography color={TEXT_COLORS.secondary}>
			{words} words / {chars} char
		</Typography>
	);
}

Counter.propTypes = {
	value: PropTypes.array.isRequired,
};

export default Counter;
