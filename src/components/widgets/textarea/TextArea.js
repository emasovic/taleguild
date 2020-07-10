import React from 'react';
import FloatingInput from '../input/FloatingInput';

export default function TextArea({value, maxLength, ...rest}) {
	const rows = value.length > 0 ? Math.ceil(value.length / 20) : 1;

	return (
		<FloatingInput {...rest} value={value} type="textarea" rows={rows} maxLength={maxLength} />
	);
}

TextArea.defaultProps = {
	maxLength: 200,
};
