import React from 'react';
import {FormGroup, Input, Label} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Checkbox.scss';

const CLASS = 'st-Checkbox';

export default function Checkbox({checked, onChange, withBorder, label, wholeEvent, ...rest}) {
	return (
		<FormGroup className={classNames(CLASS, withBorder && CLASS + '-border')}>
			<Input
				type="checkbox"
				checked={checked}
				onChange={e => onChange(wholeEvent ? e : e.target.checked)}
				{...rest}
			/>
			{label && <Label>{label}</Label>}
		</FormGroup>
	);
}

Checkbox.propTypes = {
	checked: PropTypes.bool,
	wholeEvent: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	withBorder: PropTypes.bool,
};
