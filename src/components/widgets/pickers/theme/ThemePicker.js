import React, {useState} from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';
import {Label, FormGroup} from 'reactstrap';

import {THEMES} from 'types/themes';

import './ThemePicker.scss';

const CLASS = 'st-ThemePicker';

const OPTIONS = [
	{
		value: THEMES.light,
		label: 'Light',
	},
	{
		value: THEMES.dark,
		label: 'Dark',
	},
];

export default function ThemePicker({label, ...rest}) {
	const [theme, setTheme] = useState(localStorage.getItem('theme') || THEMES.light);
	const changeTheme = theme => {
		document.documentElement.className = '';
		document.documentElement.classList.add(`theme-${theme.value}`);

		setTheme(theme.value);
		localStorage.setItem('theme', theme.value);
	};

	const value = OPTIONS.find(item => item.value === theme);

	return (
		<FormGroup className={CLASS}>
			<Label>{label}</Label>
			<Select
				onChange={val => changeTheme(val)}
				options={OPTIONS}
				value={value}
				classNamePrefix={CLASS}
				// loading={loading}
				{...rest}
			/>
		</FormGroup>
	);
}

ThemePicker.propTypes = {
	label: propTypes.string,
};

ThemePicker.defaultProps = {
	label: 'Choose theme',
};
