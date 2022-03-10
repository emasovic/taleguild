import React, {useState, useCallback} from 'react';
import Cropper from 'react-easy-crop';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '../button/IconButton';

import {getCroppedImg} from './cropperUtils';

import './ImageCropper.scss';
import FA from 'types/font_awesome';

const CLASS = 'st-ImageCropper';

export const ASPECT_RATIO = {
	square: 4 / 3,
	rectangle: 16 / 9,
};

export const CROP_SHAPE = {
	rect: 'rect',
	round: 'round',
};

const CROP_SIZE = {
	[CROP_SHAPE.round]: {width: 200, height: 200},
	[CROP_SHAPE.rect]: {width: 200, height: 150},
};

export default function ImageCropper({
	imageSrc,
	imageType,
	imageName,
	aspect,
	cropShape,
	onCrop,
	className,
}) {
	const [crop, setCrop] = useState({x: 0, y: 0});
	const [rotation, setRotation] = useState(0);
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const showCroppedImage = useCallback(async () => {
		try {
			const croppedImage = await getCroppedImg(
				imageSrc,
				imageType,
				imageName,
				croppedAreaPixels,
				rotation
			);
			onCrop(croppedImage);
		} catch (e) {
			console.error('>>>>crop error', e);
		}
	}, [imageSrc, croppedAreaPixels, onCrop, imageType, imageName, rotation]);

	const onClose = useCallback(() => {
		onCrop(null);
	}, [onCrop]);

	return (
		<div className={classNames(CLASS, className)}>
			<Cropper
				cropShape={cropShape}
				image={imageSrc}
				crop={crop}
				rotation={rotation}
				zoom={zoom}
				aspect={aspect}
				cropSize={CROP_SIZE[cropShape]}
				onCropChange={setCrop}
				onRotationChange={setRotation}
				onCropComplete={onCropComplete}
				onZoomChange={setZoom}
			/>
			<div className={CLASS + '-actions'}>
				<IconButton onClick={showCroppedImage} icon={FA.solid_clipboard_check} />
				<IconButton onClick={onClose} icon={FA.solid_baby} />
			</div>
		</div>
	);
}

ImageCropper.defaultProps = {
	aspect: ASPECT_RATIO.square,
	cropShape: CROP_SHAPE.rect,
};

ImageCropper.propTypes = {
	className: PropTypes.string,
	cropShape: PropTypes.string,
	imageName: PropTypes.string,
	imageType: PropTypes.string,
	imageSrc: PropTypes.string.isRequired,
	onCrop: PropTypes.func.isRequired,
	aspect: PropTypes.number,
};
