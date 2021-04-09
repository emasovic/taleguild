import React from 'react';
import PropTypes from 'prop-types';

import useIntersectionObserver from 'hooks/intersection-observer';

import Icon from '../icon/Icon';

import logo from 'images/taleguild-logo.svg';

import './Image.scss';

const CLASS = 'st-Image';

function Image({src, image, alt, formats, size, thumb, ...rest}) {
	const [isLoaded, setIsLoaded] = React.useState(false);

	if (formats && formats[size]) {
		image = formats[size];
	}

	if (formats?.thumbnail) {
		thumb = process.env.REACT_APP_API_URL + formats.thumbnail.url;
	}

	if (image) {
		src = process.env.REACT_APP_API_URL + image.url;
	}

	if (!src) {
		return (
			<div className={CLASS + '-fallback'}>
				<Icon />
			</div>
		);
	}

	return (
		<>
			<img
				className={`${CLASS} ${CLASS}-thumb`}
				alt={alt}
				src={thumb}
				style={{visibility: isLoaded ? 'hidden' : 'visible'}}
			/>
			<img
				onLoad={() => {
					setIsLoaded(true);
				}}
				className={`${CLASS} ${CLASS}-full`}
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
};

Image.defaultProps = {
	src: '',
	alt: 'image',
	thumb: logo,
};

const ImageContainer = props => {
	const ref = React.useRef();
	const [isVisible, setIsVisible] = React.useState(false);

	useIntersectionObserver({
		target: ref,
		onIntersect: ([{isIntersecting}], observerElement) => {
			if (isIntersecting) {
				if (!isVisible) {
					setIsVisible(true);
				}
				observerElement.unobserve(ref.current);
			}
		},
	});

	return (
		<div ref={ref} className={CLASS + '-container'}>
			{isVisible && <Image {...props} />}
		</div>
	);
};

export default ImageContainer;
