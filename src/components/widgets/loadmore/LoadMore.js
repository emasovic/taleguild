import React, {useLayoutEffect} from 'react';
import classnames from 'classnames';

import Loader from '../loader/Loader';

const CLASS = 'st-LoadMore';

export default function LoadMore({children, shouldLoad, onLoadMore, loading, className, id}) {
	const isBottom = el => {
		return el && el.getBoundingClientRect().bottom <= window.innerHeight;
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
