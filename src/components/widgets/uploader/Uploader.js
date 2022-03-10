import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useDropzone} from 'react-dropzone';
import {useDispatch} from 'react-redux';

import {uploadMedia} from 'lib/api';

import FA from 'types/font_awesome';
import {Toast} from 'types/toast';
import {COLOR} from 'types/button';

import {addToast} from 'redux/toast';
import {toggleCrop} from 'redux/app';

import Image from '../image/Image';
import IconButton from '../button/IconButton';
import ImageCropper from '../image-cropper/ImageCropper';
import Typography from '../typography/Typography';

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
	withCropper,
	cropShape,
}) {
	const dispatch = useDispatch();

	const {getRootProps, getInputProps} = useDropzone({
		multiple,
		maxSize,
		accept: acceptedTypes,
		onDropAccepted: async acceptedFiles => {
			if (withCropper) return handleUploadedFile(acceptedFiles[0]);

			if (previewOnly) {
				const files = acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				);
				return onUploaded(multiple ? files : files[0]);
			}

			await handleMediaUpload(acceptedFiles);
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

	const [uploadedFile, setUploadedFile] = useState(null);

	files = files ? (Array.isArray(files) ? files : [files]) : null;
	const showPlaceholder = !files?.length && !uploadedFile;

	const handleMediaUpload = async files => {
		try {
			const media = await uploadMedia(files);
			onUploaded(multiple ? media : media[0]);
			return true;
		} catch (error) {
			dispatch(addToast({...Toast.error(error)}));
		}
	};

	const handleUploadedFile = async file => {
		const url = await readFile(file);
		setUploadedFile({url, type: file.type, name: file.name, path: file.path});
		dispatch(toggleCrop(true));
	};

	const readFile = file => {
		return new Promise(resolve => {
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(reader.result), false);
			reader.readAsDataURL(file);
		});
	};

	const handleCrop = async file => {
		const isUploaded = await handleMediaUpload(file);
		dispatch(toggleCrop(false));
		isUploaded && setUploadedFile(null);
	};

	const thumbs = (
		<div className={CLASS + '-thumbs'}>
			{files?.length && !uploadedFile
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
				{!!showPlaceholder && (
					<>
						<Typography>{uploadlabel}</Typography>
						<Typography>
							Max file size {(maxSize / (1000 * 1000)).toFixed(0)} MB
						</Typography>
					</>
				)}
			</div>
			{thumbs}
			{uploadedFile && (
				<ImageCropper
					imageSrc={uploadedFile.url}
					imageType={uploadedFile.type}
					imageName={uploadedFile.name}
					cropShape={cropShape}
					onCrop={handleCrop}
				/>
			)}
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
	withCropper: propTypes.bool,
	cropShape: propTypes.string,
};

Uploader.defaultProps = {
	acceptedTypes: 'image/*',
	uploadlabel: 'Upload content',
	maxSize: 1000000,
	multiple: false,
	withCropper: true,
};
