import React, {useLayoutEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Loader from '../loader/Loader';

const CLASS = 'st-LoadMore';

export default function LoadMore({
	children,
	shouldLoad,
	onLoadMore,
	loading,
	className,
	NoItemsComponent,
	total,
	showItems,
	noItemsComponentProps,
	id,
}) {
	const isBottom = el => el?.getBoundingClientRect().bottom - 100 <= window.innerHeight;

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
			{showItems && children}
			{loading && (
				<div className={CLASS + '-pagination'}>
					<Loader />
				</div>
			)}
			{NoItemsComponent && !shouldLoad && !loading && !total && (
				<NoItemsComponent {...noItemsComponentProps} />
			)}
		</div>
	);
}

LoadMore.id = {
	id: 'loadMore',
};

LoadMore.propTypes = {
	children: PropTypes.any,
	shouldLoad: PropTypes.bool,
	onLoadMore: PropTypes.func,
	loading: PropTypes.bool,
	className: PropTypes.string,
	id: PropTypes.string,
	showItems: PropTypes.bool,
	total: PropTypes.number.isRequired,
	NoItemsComponent: PropTypes.func,
	noItemsComponentProps: PropTypes.object,
};
