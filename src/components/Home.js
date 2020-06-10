import React from 'react';
import {useSelector} from 'react-redux';

import {selectUser} from 'redux/user';

import Categories from './stories/widgets/Categories';
import Stories from './stories/Stories';
import StoryTabs from './stories/StoryTabs';

import './Home.scss';

const CLASS = 'st-Home';

export default function Home() {
	const {data} = useSelector(selectUser);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-header'}>
				<Categories />
			</div>
			<div className={CLASS + '-main'}>
				{data ? <StoryTabs /> : <div className={CLASS + '-main-holder'} />}
				<Stories />
				<div className={CLASS + '-main-holder'} />
			</div>
		</div>
	);
}
