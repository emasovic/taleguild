import React, {useState} from 'react';
import {Nav, NavItem} from 'reactstrap';

import './Categories.scss';

const CLASS = 'st-Categories';

const fakeCategory = [
	{title: 'Sve', id: 'sve'},
	{title: 'Poezija', id: 'poezija'},
	{title: 'Kriminalisticki', id: 'kriminalisticki'},
	{title: 'Epska fantastika', id: 'ef'},
	{title: 'Naucna fantastika', id: 'nf'},
	{title: 'Kratke Price', id: 'kratke'},
];

export default function Categories() {
	const [activeCategory, setActiveCategory] = useState('sve');
	return (
		<div className={CLASS}>
			<span>Kategorije</span>
			<Nav>
				{fakeCategory.map(item => (
					<NavItem key={item.id}>
						<p
							className={
								activeCategory === item.id ? `${CLASS}itemActive` : `${CLASS}-item`
							}
							onClick={() => setActiveCategory(item.id)}
						>
							{item.title}
						</p>
					</NavItem>
				))}
			</Nav>
		</div>
	);
}
