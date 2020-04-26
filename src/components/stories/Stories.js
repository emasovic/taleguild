import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ENV from 'env';

import {loadStories, selectStories} from '../../redux/storySlice';

import Input from 'components/widgets/input/Input';
import Loader from 'components/widgets/loader/Loader';

import StoryItem from './StoryItem';
import Categories from './Categories';

import './Stories.scss';

const CLASS = 'st-Stories';

export default function Stories() {
	const dispatch = useDispatch();
	const stories = useSelector(selectStories);
	const {loading, data} = stories;

	useEffect(() => {
		dispatch(loadStories());
	}, []);

	const renderStories = data ? (
		data.map(item => (
			<StoryItem
				src={item.image && ENV.api.url + item.image.url}
				title={item.title}
				text={item.text}
				key={item.id}
				categories={item.categories}
				creator={item.user.username}
				createdDate={item.created_at}
			/>
		))
	) : (
		<h1>Nema prica</h1>
	);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-header'}>
				<Categories />
				<div className={CLASS + '-header-filter'}>
					<Input />
				</div>
			</div>
			<div className={CLASS + '-lastest'}>{loading ? <Loader /> : renderStories}</div>
		</div>
	);
}
