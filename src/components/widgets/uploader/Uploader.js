import React, {useEffect, useState} from 'react';
import propTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';
import {useSelector, useDispatch} from 'react-redux';

import {uploadMedia} from 'lib/api';

import FA from 'types/font_awesome';
import {Toast} from 'types/toast';

import {selectUser} from 'redux/user';
import {addToast} from 'redux/toast';

import Image from '../image/Image';
import IconButton from '../button/IconButton';

import './Uploader.scss';

const CLASS = 'st-Uploader';

export default function Uploader({
	acceptedTypes,
	onUploaded,
	previewImage,
	label,
	buttonLabel,
	multiple,
}) {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const {data} = user;
	const [files, setFiles] = useState([]);
	const {getRootProps, getInputProps} = useDropzone({
		multiple,
		accept: acceptedTypes,
		onDrop: acceptedFiles => {
			uploadMedia(data && data.token, acceptedFiles)
				.then(files => onUploaded(multiple ? files : files[0]))
				.catch(err => dispatch(addToast({...Toast.error(err)})));
			setFiles(
				acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	const removeFile = index => {
		const filtered = files.filter((item, key) => key !== index);
		onUploaded(null);
		setFiles(filtered);
	};

	const thumbs = files.map((file, index) => (
		<div key={file.name} className={CLASS + '-thumbs-item'}>
			<Image src={file.preview} alt={file.name} />
			<IconButton icon={FA.remove} onClick={() => removeFile(index)} />
		</div>
	));

	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			files.forEach(file => URL.revokeObjectURL(file.preview));
		},
		[files]
	);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-thumbs'}>{thumbs.length ? thumbs : <span>{label}</span>}</div>
			{previewImage && !files.length ? (
				<div className={CLASS + '-preview'}>
					<Image image={previewImage} />
					<IconButton icon={FA.remove} onClick={() => onUploaded(null)} />
				</div>
			) : null}
			<div {...getRootProps({className: CLASS + '-dropzone'})}>
				<input {...getInputProps()} />
				<IconButton>{buttonLabel}</IconButton>
			</div>
		</div>
	);
}

Uploader.propTypes = {
	acceptedTypes: propTypes.string,
	onUploaded: propTypes.func,
	previewImage: propTypes.object,
	label: propTypes.string,
	buttonLabel: propTypes.string,
	multiple: propTypes.bool,
};

Uploader.defaultProps = {
	acceptedTypes: 'image/*',
	label: 'Dodajte sadržaj',
	buttonLabel: 'Dodaj',
	multiple: false,
};
