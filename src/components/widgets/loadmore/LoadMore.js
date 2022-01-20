import React, {useCallback, useLayoutEffect} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import useInView from 'hooks/useInView';

import Loader from '../loader/Loader';
import IconButton from '../button/IconButton';

import './LoadMore.scss';

const CLASS = 'st-LoadMore';

export default function LoadMore({
	children,
	shouldLoad,
	onLoadMore,
	loading,
	className,
	placeholderClassName,
	NoItemsComponent,
	total,
	showItems,
	noItemsComponentProps,
	id,
	isModal,
}) {
	const [ref, isVisible] = useInView();

	const checkLoadMore = useCallback(
		() => isVisible && shouldLoad && !loading && onLoadMore(),

		[onLoadMore, shouldLoad, isVisible, loading]
	);

	useLayoutEffect(() => {
		if (!isModal) {
			document.addEventListener('scroll', checkLoadMore);
			return () => {
				document.removeEventListener('scroll', checkLoadMore);
			};
		}
	});

	const classNames = classnames(CLASS, isModal && `${CLASS}-modal`, className);
	const placeholderClassNames = classnames(CLASS + '-placeholder', placeholderClassName);
	const componentProps = {};

	if (isModal) {
		componentProps.onScroll = checkLoadMore;
	}

	return (
		<div id={id} className={classNames} {...componentProps}>
			{showItems && children}
			{loading && (
				<div className={CLASS + '-loader'}>
					<Loader />
				</div>
			)}
			{NoItemsComponent && !shouldLoad && !loading && !total && showItems && (
				<NoItemsComponent {...noItemsComponentProps} />
			)}
			{!loading && <div ref={ref} className={placeholderClassNames} />}
			{shouldLoad && showItems && !loading && (
				<div className={CLASS + '-loadmore'}>
					<IconButton loading={loading} onClick={checkLoadMore}>
						Load more
					</IconButton>
				</div>
			)}
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
	placeholderClassName: PropTypes.string,
	autoFillViewport: PropTypes.bool,
	NoItemsComponent: PropTypes.func,
	noItemsComponentProps: PropTypes.object,
};
