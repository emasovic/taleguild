import React from 'react';
import propTypes from 'prop-types';

import {THEMES} from 'types/themes';

import DefaultPicker from '../default/DefaultPicker';

// import './ThemePicker.scss';

// const CLASS = 'st-ThemePicker';

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

export default function ThemePicker({label, value, onChange, ...rest}) {
	const changeTheme = theme => {
		document.documentElement.className = '';
		document.documentElement.classList.add(`theme-${theme.value}`);

		onChange(theme.value);
	};

	const theme = OPTIONS.find(item => item.value === value);

	return (
		<DefaultPicker
			onChange={changeTheme}
			label={label}
			options={OPTIONS}
			value={theme}
			{...rest}
		/>
	);
}

ThemePicker.propTypes = {
	label: propTypes.string,
	onChange: propTypes.func,
};

ThemePicker.defaultProps = {
	label: 'Choose theme',
	onChange: () => {},
};
