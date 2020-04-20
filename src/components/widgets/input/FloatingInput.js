import React from 'react';
import {Input, Label, FormGroup, FormFeedback} from 'reactstrap';

import './FloatingInput.scss';

const CLASS = 'st-FloatingInput';

export default function FloatingInput(props) {
	const {onChange, onIconClick, value, placeholder, invalid, errorMessage, label, ...rest} = props;
	return (
		<FormGroup className={CLASS}>
			{invalid && <FormFeedback>{errorMessage}</FormFeedback>}
			<Input
				name={placeholder}
				id={placeholder}
				placeholder=" "
				value={value}
				onChange={e => onChange(e.target.value)}
				invalid={invalid}
				{...rest}
			/>
			<Label for={placeholder}>{placeholder}</Label>
		</FormGroup>
	);
}
