import React from 'react';

import Header from './Header';
import Writter from './Writter';

const CLASS = 'st-StoryWritter';

export default function StoryWritter() {
	return (
		<div className={CLASS}>
			<Header />
			<Writter />
		</div>
	);
}
