import React from 'react';
import propTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';
import {useDispatch} from 'react-redux';

import {uploadMedia} from 'lib/api';

import FA from 'types/font_awesome';
import {Toast} from 'types/toast';
import {COLOR} from 'types/button';

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
	multiple,
	maxSize,
	files,
	previewOnly,
}) {
	const dispatch = useDispatch();
	const {getRootProps, getInputProps} = useDropzone({
		multiple,
		maxSize,
		accept: acceptedTypes,
		onDropAccepted: acceptedFiles => {
			if (previewOnly) {
				const files = acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				);
				return onUploaded(multiple ? files : files[0]);
			}
			uploadMedia(acceptedFiles)
				.then(files => onUploaded(multiple ? files : files[0]))
				.catch(err => dispatch(addToast({...Toast.error(err)})));
		},
		onDropRejected: () => {
			dispatch(
				addToast({
					...Toast.error(
						'The file that was uploaded is too large. Try uploading something below 1 MB.',
						'File too large'
					),
				})
			);
		},
	});

	files = files ? (Array.isArray(files) ? files : [files]) : null;

	const thumbs = (
		<div className={CLASS + '-thumbs'}>
			{files && files.length
				? files.map((file, index) => (
						<div key={index} className={CLASS + '-thumbs-item'}>
							<Image image={file} />
							<IconButton
								icon={FA.solid_times}
								color={COLOR.secondary}
								onClick={() => onRemove(index)}
							/>
						</div>
				  ))
				: null}
		</div>
	);

	return (
		<div className={CLASS}>
			<div {...getRootProps({className: CLASS + '-dropzone'})}>
				<input {...getInputProps()} />
				{!files || !files.length ? (
					<>
						<span>{uploadlabel}</span>
						<span>Max file size {(maxSize / (1000 * 1000)).toFixed(0)} MB</span>
					</>
				) : null}
			</div>
			{thumbs}
		</div>
	);
}

Uploader.propTypes = {
	acceptedTypes: propTypes.string,
	onUploaded: propTypes.func,
	onRemove: propTypes.func,
	previewOnly: propTypes.bool,
	files: propTypes.oneOfType([propTypes.object, propTypes.array]),
	uploadlabel: propTypes.string,
	buttonLabel: propTypes.string,
	maxSize: propTypes.number,
	multiple: propTypes.bool,
};

Uploader.defaultProps = {
	acceptedTypes: 'image/*',
	uploadlabel: 'Upload content',
	maxSize: 1000000,
	multiple: false,
};
