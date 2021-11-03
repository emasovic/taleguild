import React from 'react';
import {FormGroup, Input, Label} from 'reactstrap';
import PropTypes from 'prop-types';

import './Checkbox.scss';

const CLASS = 'st-Checkbox';

export default function Checkbox({checked, onChange, label}) {
	return (
		<FormGroup check inline className={CLASS}>
			<Input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
			{label && <Label check>{label}</Label>}
		</FormGroup>
	);
}

Checkbox.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	label: PropTypes.string,
};
