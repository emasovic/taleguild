import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {createStory} from '../../redux/storySlice';
import {selectUser} from '../../redux/userSlice';

import FloatingInput from '../widgets/input/FloatingInput';
import TextEditor from '../widgets/text-editor/TextEditor';
import IconButton from '../widgets/button/IconButton';
import ImageUploader from '../widgets/image-uploader/ImageUploader';

import './NewStory.scss';

const CLASS = 'st-NewStory';

export default function NewStory() {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const [image, setImage] = useState(null);
	return (
		<div className={CLASS}>
			<div className={CLASS + '-title'}>
				<FloatingInput placeholder="Title" value={title} onChange={val => setTitle(val)} />
				<ImageUploader onUploaded={setImage} multiple={false} />
			</div>
			<div className={CLASS + '-editor'}>
				<TextEditor onChange={setText} value={text} />
			</div>
			<div className={CLASS + '-button'}>
				<IconButton
					onClick={() =>
						dispatch(
							createStory({
								title,
								text,
								image: image && image[0].id,
								user: user && user.id,
							})
						)
					}
				>
					Create
				</IconButton>
			</div>
		</div>
	);
}
