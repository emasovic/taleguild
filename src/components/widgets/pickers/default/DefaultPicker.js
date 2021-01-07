import React from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';
import {Label, FormGroup} from 'reactstrap';
import classnames from 'classnames';

import './DefaultPicker.scss';

const CLASS = 'st-DefaultPicker';

export default function DefaultPicker({
	onChange,
	value,
	options,
	label,
	invalid,
	errorMessage,
	...rest
}) {
	const classNames = classnames(CLASS, invalid && 'invalid');
	return (
		<FormGroup className={classNames}>
			<Label>{label}</Label>
			<Select
				onChange={val => onChange(val)}
				options={options}
				value={value}
				classNamePrefix={CLASS}
				{...rest}
			/>
			{invalid && <span className={CLASS + '-error'}>{errorMessage}</span>}
		</FormGroup>
	);
}

DefaultPicker.propTypes = {
	onChange: propTypes.func,
	invalid: propTypes.bool,
	value: propTypes.object,
	options: propTypes.array,
	errorMessage: propTypes.string,
	label: propTypes.string,
};

DefaultPicker.defaultProps = {
	onChange: () => {},
};
