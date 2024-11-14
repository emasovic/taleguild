import React from 'react';
import propTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {DEFAULT_OP} from 'types/default';

import {selectLanguages} from 'redux/languages';

import DefaultPicker from '../default/DefaultPicker';

export default function LanguagePicker({onChange, value, label, ...rest}) {
	const languages = useSelector(selectLanguages);
	const {op} = useSelector(state => state.languages);

	const options = languages.map(item => ({value: item.id, label: item.name}));
	return (
		<DefaultPicker
			label={label}
			onChange={onChange}
			options={options}
			value={value}
			loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
			{...rest}
		/>
	);
}

LanguagePicker.propTypes = {
	value: propTypes.any,
	label: propTypes.string,
	onChange: propTypes.func,
};

LanguagePicker.defaultProps = {
	onChange: () => {},
};
