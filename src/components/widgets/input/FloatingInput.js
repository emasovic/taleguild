import React from 'react';
import propTypes from 'prop-types';
import {Input, Label, FormGroup, FormFeedback} from 'reactstrap';

import './FloatingInput.scss';

const CLASS = 'st-FloatingInput';

export default function FloatingInput(props) {
	const {onChange, value, placeholder, invalid, errorMessage, label, ...rest} = props;
	return (
		<FormGroup className={CLASS}>
			<Label>{label}</Label>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				invalid={invalid}
				{...rest}
			/>
			{invalid && <FormFeedback>{errorMessage}</FormFeedback>}
		</FormGroup>
	);
}

FloatingInput.propTypes = {
	onChange: propTypes.func,
	value: propTypes.string,
	placeholder: propTypes.string,
	label: propTypes.string,
	errorMessage: propTypes.string,
};

FloatingInput.defaultProps = {
	onChange: () => {},
};
