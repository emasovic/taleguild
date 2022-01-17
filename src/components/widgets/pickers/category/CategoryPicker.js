import React from 'react';
import propTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {DEFAULT_OP} from 'types/default';

import {selectCategories} from 'redux/categories';

import DefaultPicker from '../default/DefaultPicker';

export default function CategoryPicker({onChange, value, label, ...rest}) {
	const categories = useSelector(selectCategories);
	const {op} = useSelector(state => state.categories);
	const options = categories.map(item => ({value: item.id, label: item.display_name}));

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

CategoryPicker.propTypes = {
	onChange: propTypes.func,
	value: propTypes.any,
	label: propTypes.string,
};

CategoryPicker.defaultProps = {
	onChange: () => {},
};
