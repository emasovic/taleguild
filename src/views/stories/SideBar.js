import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';

import Categories from './widgets/categories/Categories';
import Languages from './widgets/languages/Languages';

import './SideBar.scss';

const CLASS = 'st-SideBar';

const SIDEBAR_TABS = {
	categories: 'categories',
	languages: 'languages',
};

const COMPONENTS = {
	[SIDEBAR_TABS.categories]: Categories,
	[SIDEBAR_TABS.languages]: Languages,
};

export default function SideBar() {
	const [activeTab, setActiveTab] = useState(SIDEBAR_TABS.categories);

	const Component = COMPONENTS[activeTab];

	return (
		<div className={CLASS}>
			<Nav className={CLASS + '-tabs'}>
				<NavItem onClick={() => setActiveTab(SIDEBAR_TABS.categories)}>
					<NavLink href="#" active={activeTab === SIDEBAR_TABS.categories}>
						Categories
					</NavLink>
				</NavItem>
				<NavItem onClick={() => setActiveTab(SIDEBAR_TABS.languages)}>
					<NavLink href="#" active={activeTab === SIDEBAR_TABS.languages}>
						Languages
					</NavLink>
				</NavItem>
			</Nav>
			<Component />
		</div>
	);
}
