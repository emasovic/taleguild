import React from 'react';
import PropTypes from 'prop-types';

import FloatingInput from '../input/FloatingInput';

export default function TextArea({value, maxLength, cols, ...rest}) {
	const rows = value.length > 0 ? Math.ceil(value.length / cols) : 1;

	return (
		<FloatingInput
			{...rest}
			value={value}
			type="textarea"
			cols={cols}
			rows={rows}
			maxLength={maxLength}
		/>
	);
}

TextArea.propTypes = {
	value: PropTypes.string,
	maxLength: PropTypes.number,
	cols: PropTypes.number,
};

TextArea.defaultProps = {
	maxLength: 200,
	cols: 26,
};
