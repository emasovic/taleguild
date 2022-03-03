import React from 'react';
import {useState} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {ICONS, ICON_TYPES} from 'types/icons';
import {THEMES} from 'types/themes';

import IconButton from '../button/IconButton';

import './ThemeSwitch.scss';

const THEME_ICON = {
	[THEMES.dark]: ICONS.moon,
	[THEMES.light]: ICONS.sun,
};

const CLASS = 'st-ThemeSwitch';

export default function ThemeSwitch({className}) {
	const [theme, setTheme] = useState(localStorage.getItem('theme'));

	const changeTheme = () => {
		const changedTeme = theme === THEMES.dark ? THEMES.light : THEMES.dark;
		document.documentElement.className = '';
		document.documentElement.classList.add(`theme-${changedTeme}`);
		localStorage.setItem('theme', changedTeme);
		setTheme(changedTeme);
	};

	return (
		<div className={classNames(CLASS, className)}>
			<IconButton
				onClick={() => changeTheme(theme)}
				tertiary
				outline
				icon={THEME_ICON[theme]}
				iconType={ICON_TYPES.local}
			/>
		</div>
	);
}

ThemeSwitch.propTypes = {
	className: PropTypes.string,
};
