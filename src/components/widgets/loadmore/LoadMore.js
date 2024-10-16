import React, {useLayoutEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/Loader';

const CLASS = 'st-LoadMore';

export default function LoadMore({children, shouldLoad, onLoadMore, loading, className, id}) {
	const isBottom = el => {
		return el && el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
	};

	const trackScrolling = () => {
		const wrappedElement = document.getElementById(id);

		if (isBottom(wrappedElement) && shouldLoad) {
			onLoadMore();
		}
	};

	useLayoutEffect(() => {
		document.addEventListener('scroll', trackScrolling);
		return () => {
			document.removeEventListener('scroll', trackScrolling);
		};
	});

	const classNames = className ? classnames(CLASS, className) : CLASS;

	return (
		<div id={id} className={classNames}>
			{children}
			{loading && (
				<div className={CLASS + '-pagination'}>
					<Loader />
				</div>
			)}
		</div>
	);
}

LoadMore.propTypes = {
	children: PropTypes.any,
	shouldLoad: PropTypes.bool,
	onLoadMore: PropTypes.func,
	loading: PropTypes.bool,
	className: PropTypes.string,
	id: PropTypes.string,
};
