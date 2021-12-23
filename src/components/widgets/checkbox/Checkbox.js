import React from 'react';
import {FormFeedback, FormGroup, Input, Label} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Checkbox.scss';

const CLASS = 'st-Checkbox';

export default function Checkbox({
	checked,
	onChange,
	withBorder,
	label,
	wholeEvent,
	invalid,
	errorMessage,
	...rest
}) {
	return (
		<FormGroup className={classNames(CLASS, withBorder && CLASS + '-border')}>
			<div className={CLASS + '-wrapper'}>
				<Input
					type="checkbox"
					checked={checked}
					onChange={e => onChange(wholeEvent ? e : e.target.checked)}
					{...rest}
				/>
				{label && <Label>{label}</Label>}
			</div>
			{invalid && <FormFeedback invalid>{errorMessage}</FormFeedback>}
		</FormGroup>
	);
}

Checkbox.propTypes = {
	checked: PropTypes.bool,
	wholeEvent: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	withBorder: PropTypes.bool,
	invalid: PropTypes.bool,
	errorMessage: PropTypes.string,
};
