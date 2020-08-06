import React from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';
import {Label, FormGroup} from 'reactstrap';
import {useSelector} from 'react-redux';

import {selectLanguages} from 'redux/languages';

import './LanguagePicker.scss';

const CLASS = 'st-LanguagePicker';

export default function LanguagePicker({onChange, value, label, ...rest}) {
	const {languages, loading} = useSelector(state => ({
		loading: state.categories.loading,
		languages: selectLanguages(state),
	}));
	const options = languages.map(item => ({value: item.id, label: item.name}));
	return (
		<FormGroup className={CLASS}>
			<Label>{label}</Label>
			<Select
				onChange={val => onChange(val)}
				options={options}
				value={value}
				classNamePrefix={CLASS}
				loading={loading}
				{...rest}
			/>
		</FormGroup>
	);
}

LanguagePicker.propTypes = {
	onChange: propTypes.func,
};

LanguagePicker.defaultProps = {
	onChange: () => {},
};
