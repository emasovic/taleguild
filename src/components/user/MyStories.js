import React from 'react';

import Stories from 'components/stories/Stories';

const CLASS = 'st-MyStories';

export default function MyStories(props) {
	const {id} = props.match.params;

	return (
		<div className={CLASS}>
			<Stories params={{user: id}} displayCategoies={false}/>
		</div>
	);
}
