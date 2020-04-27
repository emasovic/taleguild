import React, {useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {loadStories, selectStories} from '../../redux/storySlice';

import Input from 'components/widgets/input/Input';
import Loader from 'components/widgets/loader/Loader';

import StoryItem from './StoryItem';
import Categories from './Categories';

import './Stories.scss';

const CLASS = 'st-Stories';

export default function Stories() {
	const dispatch = useDispatch();
	const {data, loading} = useSelector(
		state => ({
			data: selectStories(state),
			loading: state.stories.loading,
		}),
		shallowEqual
	);

	useEffect(() => {
		dispatch(loadStories());
	}, []);

	const renderStories = data ? (
		data.map(item => (
			<StoryItem
				id={item.id}
				image={item.image}
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
