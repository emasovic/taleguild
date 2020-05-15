import React from 'react';
import {useSelector} from 'react-redux';

import {selectUser} from 'redux/user';

import Stories from 'components/stories/Stories';

const CLASS = 'st-MyStories';

export default function MyStories() {
	const {data} = useSelector(selectUser);

	const criteria = {
		_start: 0,
		_limit: 12,
		_sort: 'created_at:DESC',
		user: data && data.id,
	};
	return (
		<div className={CLASS}>
			<Stories criteria={criteria} editMode displayCategoies={false} />
		</div>
	);
}
