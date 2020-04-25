import React, {useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';

import {loadStories, selectStories} from '../../redux/storySlice';

import './Stories.scss';
import StoryItem from './StoryItem';
import Categories from './Categories';
import Input from 'components/widgets/input/Input';

const CLASS = 'st-Stories';

export default function Stories() {
	const dispatch = useDispatch();
	const stories = useSelector(selectStories);
	const path = 'https://pricajmi.herokuapp.com';

	useEffect(() => {
		dispatch(loadStories());
	}, []);
	console.log('>>>>>>>>>>>>>....', stories);

	const renderStories = stories ? (
		stories.map(item => (
			<StoryItem
				src={path + item.image.url}
				title={item.title}
				text={item.text}
				key={item.id}
				creator={item.user.username}
				createdDate={item.created_at}
			/>
		))
	) : (
		<h1>Nema nista</h1>
	);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-filterBox'}>
				<Categories />
				<div className="st-filter">
					<Input />
				</div>
			</div>
			<Row>
				{renderStories} {renderStories} {renderStories} {renderStories} {renderStories}{' '}
				{renderStories}
			</Row>
		</div>
	);
}
