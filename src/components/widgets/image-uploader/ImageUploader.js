import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useSelector} from 'react-redux';

import {uploadMedia} from 'lib/api';

import {selectUser} from 'redux/userSlice';

import Image from '../image/Image';

export default function ImageUploader(props) {
	const user = useSelector(selectUser);
	const {data} = user;
	const [files, setFiles] = useState([]);
	const {getRootProps, getInputProps} = useDropzone({
		accept: 'image/*',
		onDrop: acceptedFiles => {
			uploadMedia(data && data.token, acceptedFiles)
				.then(files => props.onUploaded(files))
				.catch(err => console.log('err', err));
			setFiles(
				acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	const thumbs = files.map(file => (
		<div key={file.name}>
			<div>
				<Image src={file.preview} alt={file.name} />
			</div>
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
		<section className="container">
			<div {...getRootProps({className: 'dropzone'})}>
				<input {...getInputProps()} />
				<p>Drag 'n' drop some files here, or click to select files</p>
			</div>
			<aside>{thumbs}</aside>
		</section>
	);
}
