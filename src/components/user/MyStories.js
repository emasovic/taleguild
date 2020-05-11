import React from 'react';
import {useParams} from 'react-router-dom';

import Stories from 'components/stories/Stories';

const CLASS = 'st-MyStories';

export default function MyStories() {
	const {id} = useParams();

	const criteria = {
		_start: 0,
		_limit: 12,
		_sort: 'created_at:DESC',
		user: id,
	};
	return (
		<div className={CLASS}>
			<Stories criteria={criteria} editMode displayCategoies={false} />
		</div>
	);
}
