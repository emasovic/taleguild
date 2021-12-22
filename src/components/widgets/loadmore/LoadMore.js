import React, {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import {isElementInViewport} from 'lib/util';

import Loader from '../loader/Loader';

import './LoadMore.scss';

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
	const autoFillRef = useRef(null);

	const checkLoadMore = useCallback(() => {
		if (isElementInViewport(autoFillRef?.current) && shouldLoad && !loading) {
			onLoadMore();
		}
	}, [onLoadMore, shouldLoad, loading]);

	useEffect(() => {
		checkLoadMore();
	}, [checkLoadMore]);

	useLayoutEffect(() => {
		if (!isModal) {
			document.addEventListener('scroll', checkLoadMore);
			return () => {
				document.removeEventListener('scroll', checkLoadMore);
			};
		}
	});

	const classNames = classnames(CLASS, isModal && `${CLASS}-modal`, className);
	const componentProps = {};

	if (isModal) {
		componentProps.onScroll = checkLoadMore;
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
			<div ref={autoFillRef} />
		</div>
	);
}

LoadMore.defaultProps = {
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
