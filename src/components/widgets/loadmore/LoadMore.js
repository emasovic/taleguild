import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
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
	autoFillViewport,
}) {
	const autoFillRef = useRef(null);
	const [isInViewport, setIsInViewport] = useState(true);

	const checkLoadMore = useCallback(() => {
		if (!isElementInViewport(autoFillRef?.current) && isInViewport) setIsInViewport(false);

		if (isElementInViewport(autoFillRef?.current) && shouldLoad && !loading) {
			onLoadMore();
		}
	}, [onLoadMore, shouldLoad, isInViewport, loading]);

	useEffect(() => {
		autoFillViewport && isInViewport && checkLoadMore();

		return () => {
			!isInViewport && setIsInViewport(true);
		};
	}, [checkLoadMore, autoFillViewport, isInViewport]);

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
	autoFillViewport: true,
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
	autoFillViewport: PropTypes.bool,
	NoItemsComponent: PropTypes.func,
	noItemsComponentProps: PropTypes.object,
};
