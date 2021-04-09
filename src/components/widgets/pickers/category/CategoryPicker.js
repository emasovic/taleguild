import React from 'react';
import propTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {selectCategories} from 'redux/categories';

import DefaultPicker from '../default/DefaultPicker';

// import './CategoryPicker.scss';

// const CLASS = 'st-CategoryPicker';

export default function CategoryPicker({onChange, value, label, ...rest}) {
	const {categories, loading} = useSelector(state => ({
		loading: state.categories.loading,
		categories: selectCategories(state),
	}));
	const options = categories.map(item => ({value: item.id, label: item.display_name}));

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

CategoryPicker.propTypes = {
	onChange: propTypes.func,
	value: propTypes.any,
	label: propTypes.string,
};

CategoryPicker.defaultProps = {
	onChange: () => {},
};
