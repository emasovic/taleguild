import React from 'react';
import FloatingInput from '../input/FloatingInput';

export default function TextArea({value, maxLength, cols, ...rest}) {
	const rows = value.length > 0 ? Math.ceil(value.length / cols) : 1;

	return (
		<FloatingInput {...rest} value={value} type="textarea" cols={cols} rows={rows} maxLength={maxLength} />
	);
}

TextArea.defaultProps = {
	maxLength: 200,
	cols: 26,
};
