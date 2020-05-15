import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Input} from 'reactstrap';

import {Toast} from 'types/toast';

import {createOrUpdateStory} from '../../redux/story';
import {selectUser} from '../../redux/user';
import {addToast} from 'redux/toast';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import Checkbox from 'components/widgets/checkbox/Checkbox';
import FloatingInput from '../widgets/input/FloatingInput';
import TextEditor from '../widgets/text-editor/TextEditor';
import IconButton from '../widgets/button/IconButton';
import Uploader from '../widgets/uploader/Uploader';

import './NewStory.scss';

const CLASS = 'st-NewStory';

export default function NewStory({story}) {
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(selectUser);
	const {data, loading} = user;

	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState([]);
	const [image, setImage] = useState(null);
	const [published, setPublished] = useState(false);

	const validate = () => {
		const errors = [];

		title.length <= 3 && errors.push('Title too short! \n');
		!category.length && errors.push('You must select category!');
		text.length <= 3 && errors.push('Story too short! \n');
		description.length <= 3 && errors.push('Description too short! \n');

		if (errors.length) {
			return dispatch(addToast(Toast.error(errors)));
		}

		return true;
	};

	const create = () => {
		if (validate()) {
			const payload = {
				id: story && story.id,
				title,
				text,
				published,
				image: image && image.id,
				user: data && data.id,
				description,
				categories: category.length && category.map(item => item.value),
			};

			dispatch(createOrUpdateStory(payload, history));
		}
	};

	useEffect(() => {
		if (story) {
			setTitle(story.title);
			setText(story.text);
			setDescription(story.description || '');
			setCategory(story.categories.map(item => ({label: item.name, value: item.id})));
			setImage(story.image);
			setPublished(story.published);
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

			<Checkbox
				label="Objavljena"
				checked={published}
				onChange={checked => setPublished(checked)}
			/>

			<div className={CLASS + '-button'}>
				<IconButton loading={loading} onClick={create}>
					Sačuvaj
				</IconButton>
			</div>
		</div>
	);
}
