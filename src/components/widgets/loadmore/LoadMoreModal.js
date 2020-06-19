import React from 'react';
import classnames from 'classnames';

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
