import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useIntersectionObserver from 'hooks/intersection-observer';

import Icon from '../icon/Icon';

import logo from 'images/taleguild-logo.svg';

import './Image.scss';

const CLASS = 'st-Image';

function Image({src, image, alt, formats, size, thumb, thumbClassName, imageClassName, ...rest}) {
	const [isLoaded, setIsLoaded] = React.useState(false);

	if (formats && formats[size]) {
		image = formats[size];
	}

	if (image) {
		src = process.env.REACT_APP_API_URL + image.url;
	}

	if (formats?.thumbnail || src) {
		thumb = src || process.env.REACT_APP_API_URL + formats?.thumbnail?.url;
	}

	if (!src) {
		return (
			<div className={CLASS + '-fallback'}>
				<Icon />
			</div>
		);
	}

	const thumbClass = classNames(CLASS, `${CLASS}-thumb`, thumbClassName);
	const imageClass = classNames(CLASS, `${CLASS}-full`, imageClassName);
	return (
		<>
			<img
				className={thumbClass}
				alt={alt}
				src={thumb}
				style={{visibility: isLoaded ? 'hidden' : 'visible'}}
			/>
			<img
				onLoad={() => {
					setIsLoaded(true);
				}}
				className={imageClass}
				style={{opacity: isLoaded ? 1 : 0}}
				alt={alt}
				src={src}
				{...rest}
			/>
		</>
	);
}

Image.propTypes = {
	image: PropTypes.object,
	src: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	alt: PropTypes.string,
	formats: PropTypes.object,
	size: PropTypes.string,
	thumb: PropTypes.string,
	thumbClassName: PropTypes.string,
	imageClassName: PropTypes.string,
};

Image.defaultProps = {
	src: '',
	alt: 'image',
	thumb: logo,
};

const ImageContainer = ({containerClassName, ...props}) => {
	const ref = React.useRef();
	const [isVisible, setIsVisible] = React.useState(false);

	useIntersectionObserver({
		target: ref,
		onIntersect: ([{isIntersecting}], observerElement) => {
			if (isIntersecting) {
				if (!isVisible) {
					setIsVisible(true);
				}
				ref?.current && observerElement.unobserve(ref.current);
			}
		},
	});

	const className = classNames(CLASS + '-container', containerClassName);
	return (
		<div ref={ref} className={className}>
			{isVisible && <Image {...props} />}
		</div>
	);
};

ImageContainer.propTypes = {
	containerClassName: PropTypes.string,
	image: PropTypes.object,
	src: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	alt: PropTypes.string,
	formats: PropTypes.object,
	size: PropTypes.string,
	thumb: PropTypes.string,
	thumbClassName: PropTypes.string,
	imageClassName: PropTypes.string,
};

export default ImageContainer;
