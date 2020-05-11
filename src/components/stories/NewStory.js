import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Input} from 'reactstrap';

import {createOrUpdateStory} from '../../redux/story';
import {selectUser} from '../../redux/user';

import FloatingInput from '../widgets/input/FloatingInput';
import TextEditor from '../widgets/text-editor/TextEditor';
import IconButton from '../widgets/button/IconButton';
import Uploader from '../widgets/uploader/Uploader';
import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';

import './NewStory.scss';

const CLASS = 'st-NewStory';

export default function NewStory({story}) {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(selectUser);
	const {data} = user;

	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState([]);
	const [image, setImage] = useState(null);

	const create = () => {
		const payload = {
			id: story && story.id,
			title,
			text,
			published: true,
			image: image && image.id,
			user: data && data.id,
			description,
			categories: category.length && category.map(item => item.value),
		};

		dispatch(createOrUpdateStory(payload, history));
	};

	useEffect(() => {
		if (story) {
			setTitle(story.title);
			setText(story.text);
			setDescription(story.description);
			setCategory(story.categories.map(item => ({label: item.name, value: item.id})));
			setImage(story.image);
		}
	}, [story]);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-title'}>
				<FloatingInput placeholder="Naslov" value={title} onChange={val => setTitle(val)} />
				<CategoryPicker
					placeholder="Izaberite kategoriju"
					isMulti
					onChange={setCategory}
					value={category}
				/>
			</div>
			<div className={CLASS + '-uploader'}>
				<Uploader onUploaded={setImage} onRemove={() => setImage(null)} files={image} />
			</div>

			<div className={CLASS + '-editor'}>
				<TextEditor onChange={setText} value={text} />
			</div>
			<Input
				rows={5}
				type="textarea"
				value={description}
				placeholder="Opis price ..."
				onChange={e => setDescription(e.target.value)}
			/>
			<Input type="checkbox" />
			<div className={CLASS + '-button'}>
				<IconButton onClick={create}>Sačuvaj</IconButton>
			</div>
		</div>
	);
}
