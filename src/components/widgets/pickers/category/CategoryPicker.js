import React from 'react';
import Select from 'react-select';
import propTypes from 'prop-types';

import {useLoadCategories} from 'hooks/categories';

import './CategoryPicker.scss';

const CLASS = 'st-CategoryPicker';

export default function CategoryPicker({onChange, value, ...rest}) {
	const [{data, isLoading}] = useLoadCategories();
	const options = data.map(item => ({value: item.id, label: item.display_name}));
	return (
		<Select
			onChange={val => onChange(val)}
			options={options}
			value={value}
			className={CLASS}
			loading={isLoading}
			{...rest}
		/>
	);
}

CategoryPicker.propTypes = {
	onChange: propTypes.func,
};

CategoryPicker.defaultProps = {
	onChange: () => {},
};
