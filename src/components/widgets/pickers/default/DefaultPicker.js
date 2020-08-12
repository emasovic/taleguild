import React from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';
import {Label, FormGroup} from 'reactstrap';

import './DefaultPicker.scss';

const CLASS = 'st-DefaultPicker';

export default function DefaultPicker({onChange, value, options, label, ...rest}) {
	return (
		<FormGroup className={CLASS}>
			<Label>{label}</Label>
			<Select
				onChange={val => onChange(val)}
				options={options}
				value={value}
				classNamePrefix={CLASS}
				{...rest}
			/>
		</FormGroup>
	);
}

DefaultPicker.propTypes = {
	onChange: propTypes.func,
};

DefaultPicker.defaultProps = {
	onChange: () => {},
};
