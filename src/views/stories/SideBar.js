import React from 'react';

import Categories from './widgets/categories/Categories';
import Languages from './widgets/languages/Languages';

import DottedList from 'components/widgets/lists/dotted-list/DottedList';

export default function SideBar() {
	const items = [
		{
			name: 'Categories',
			component: Categories,
		},
		{
			name: 'Languages',
			component: Languages,
		},
	];

	return <DottedList items={items} initialActive={items[0]} />;
}
