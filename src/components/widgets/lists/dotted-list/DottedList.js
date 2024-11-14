import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink} from 'reactstrap';
import classNames from 'classnames';

import './DottedList.scss';

const CLASS = 'st-DottedList';

function DottedList({items, className, initialActive}) {
	const [activeTab, setActiveTab] = useState(initialActive);

	const Component = activeTab.component;
	let props = {};

	if (activeTab.componentProps) {
		props = {...props, ...activeTab.componentProps};
	}

	return (
		<div className={classNames(CLASS, className)}>
			<Nav className={CLASS + '-tabs'}>
				{items.map(i => (
					<NavItem key={i.name} onClick={() => setActiveTab(i)}>
						<NavLink href="#" active={activeTab.name === i.name}>
							{i.name}
						</NavLink>
					</NavItem>
				))}
			</Nav>
			<Component {...props} />
		</div>
	);
}

DottedList.propTypes = {
	items: PropTypes.array.isRequired,
	className: PropTypes.string,
	initialActive: PropTypes.object.isRequired,
};

export default DottedList;
