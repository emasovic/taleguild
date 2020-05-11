import React from 'react';
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
	onRemove,
	uploadlabel,
	buttonLabel,
	multiple,
	files,
}) {
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const {data} = user;
	const {getRootProps, getInputProps} = useDropzone({
		multiple,
		accept: acceptedTypes,
		onDrop: acceptedFiles => {
			uploadMedia(data && data.token, acceptedFiles)
				.then(files => onUploaded(multiple ? files : files[0]))
				.catch(err => dispatch(addToast({...Toast.error(err)})));
		},
	});

	files = files ? (Array.isArray(files) ? files : [files]) : null;

	const thumbs =
		files && files.length
			? files.map((file, index) => (
					<div key={index} className={CLASS + '-thumbs-item'}>
						<Image image={file} />
						<IconButton icon={FA.remove} onClick={() => onRemove(index)} />
					</div>
			  ))
			: null;

	return (
		<div className={CLASS}>
			<div className={CLASS + '-thumbs'}>{thumbs ? thumbs : <span>{uploadlabel}</span>}</div>
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
	onRemove: propTypes.func,
	files: propTypes.oneOfType([propTypes.object, propTypes.array]),
	uploadlabel: propTypes.string,
	buttonLabel: propTypes.string,
	multiple: propTypes.bool,
};

Uploader.defaultProps = {
	acceptedTypes: 'image/*',
	uploadlabel: 'Dodajte sadržaj',
	buttonLabel: 'Dodaj',
	multiple: false,
};
