import React from 'react';
import {CustomInput} from 'reactstrap';

import './Checkbox.scss';

const CLASS = 'st-Checkbox';

export default function Checkbox({checked, onChange, label}) {
	return (
		<CustomInput
			id="st1"
			className={CLASS}
			type="checkbox"
			label={label}
			checked={checked}
			onChange={(e) => onChange(e.target.checked)}
		/>
	);
}
