import React from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';
import {Label, FormGroup} from 'reactstrap';
import {useSelector} from 'react-redux';

import {selectCategories} from 'redux/categories';

import './CategoryPicker.scss';

const CLASS = 'st-CategoryPicker';

export default function CategoryPicker({onChange, value, label, ...rest}) {
	const {categories, loading} = useSelector(state => ({
		loading: state.categories.loading,
		categories: selectCategories(state),
	}));
	const options = categories.map(item => ({value: item.id, label: item.display_name}));
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

CategoryPicker.propTypes = {
	onChange: propTypes.func,
};

CategoryPicker.defaultProps = {
	onChange: () => {},
};
