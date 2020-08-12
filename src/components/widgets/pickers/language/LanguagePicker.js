import React from 'react';
import propTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {selectLanguages} from 'redux/languages';

import DefaultPicker from '../default/DefaultPicker';

// import './LanguagePicker.scss';

// const CLASS = 'st-LanguagePicker';

export default function LanguagePicker({onChange, value, label, ...rest}) {
	const {languages, loading} = useSelector(state => ({
		loading: state.categories.loading,
		languages: selectLanguages(state),
	}));
	console.log(value)
	const options = languages.map(item => ({value: item.id, label: item.name}));
	return (
		<DefaultPicker
			label={label}
			onChange={onChange}
			options={options}
			value={value}
			loading={loading}
			{...rest}
		/>
	);
}

LanguagePicker.propTypes = {
	onChange: propTypes.func,
};

LanguagePicker.defaultProps = {
	onChange: () => {},
};
