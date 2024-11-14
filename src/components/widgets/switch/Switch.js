import React from 'react';
import PropTypes from 'prop-types';
import {FormGroup, Input, Label} from 'reactstrap';
import classNames from 'classnames';

import './Switch.scss';

const CLASS = 'st-Switch';

function Switch({checked, onChange, labelChecked, labelUnchecked, wholeEvent, className, ...rest}) {
	return (
		<FormGroup className={classNames(CLASS, className)} check>
			<Input
				id="switch"
				type="checkbox"
				checked={checked}
				onChange={e => onChange(wholeEvent ? e : e.target.checked)}
				{...rest}
			/>
			<Label for="switch">
				<div
					className={CLASS + '-label'}
					data-checked={labelChecked}
					data-unchecked={labelUnchecked}
				/>
			</Label>
		</FormGroup>
	);
}

Switch.propTypes = {
	checked: PropTypes.bool,
	wholeEvent: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	labelChecked: PropTypes.string,
	labelUnchecked: PropTypes.string,
	label: PropTypes.string,
	className: PropTypes.string,
};

Switch.defaultProps = {
	labelChecked: 'On',
	labelUnchecked: 'Off',
	onChange: () => {},
};

export default Switch;
