import React from 'react';

import {useSelector} from 'react-redux';

import {DEFAULT_OP} from 'types/default';

import {selectCategories} from 'redux/categories';

import SideNav from 'components/widgets/side-nav/SideNav';

export default function Categories() {
	const {op} = useSelector(state => state.categories);
	const categories = useSelector(selectCategories);

	return (
		<SideNav
			items={categories}
			urlParamName="categories"
			loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
		/>
	);
}
