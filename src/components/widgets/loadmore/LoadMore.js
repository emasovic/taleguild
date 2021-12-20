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
	isModal,
}) {
	const isBottom = el => {
		return isModal
			? el?.scrollHeight - el?.scrollTop <= el?.clientHeight
			: el?.getBoundingClientRect().bottom - 100 <= window.innerHeight;
	};

	const trackScrolling = () => {
		const wrappedElement = document.getElementById(id);

		if (isBottom(wrappedElement) && shouldLoad) {
			onLoadMore();
		}
	};

	useLayoutEffect(() => {
		if (!isModal) {
			document.addEventListener('scroll', trackScrolling);
			return () => {
				document.removeEventListener('scroll', trackScrolling);
			};
		}
	});

	const classNames = classnames(CLASS, isModal && `${CLASS}-modal`, className);

	const componentProps = {};

	if (isModal) {
		componentProps.onScroll = trackScrolling;
	}

	return (
		<div id={id} className={classNames} {...componentProps}>
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
	isModal: PropTypes.bool,
	total: PropTypes.number.isRequired,
	NoItemsComponent: PropTypes.func,
	noItemsComponentProps: PropTypes.object,
};
