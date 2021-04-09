import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/Loader';

const CLASS = 'st-LoadMore';

export default function LoadMore({children, shouldLoad, onLoadMore, loading, className, id}) {
	const isBottom = el => {
		return el && el.scrollHeight - el.scrollTop === el.clientHeight;
	};

	const trackScrolling = () => {
		const wrappedElement = document.getElementById(id);

		if (isBottom(wrappedElement) && shouldLoad) {
			onLoadMore();
		}
	};

	const classNames = className ? classnames(CLASS, className) : CLASS;

	return (
		<div id={id} className={classNames} onScroll={trackScrolling}>
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
	id: PropTypes.number,
};
