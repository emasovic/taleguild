import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {loadSavedBy, selectSavedBy} from 'redux/savedBy';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from 'views/user/UserAvatar';

function SavedByDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();
	const {savedBy, op, pages} = useSelector(
		state => ({
			savedBy: selectSavedBy(state),
			op: state.savedBy.op,
			pages: state.savedBy.pages,
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);

	const renderContent = () => {
		return (
			<LoadMoreModal
				className={className + '-likes'}
				onLoadMore={handleCount}
				loading={op === DEFAULT_OP.load_more}
				initLoading={op === DEFAULT_OP.loading}
				shouldLoad={pages > currentPage}
				id="storySavedBy"
			>
				{savedBy.length ? (
					savedBy.map((item, key) => {
						const {user} = item;
						return (
							<Link
								to={goToUser(user.username)}
								key={key}
								className={className + '-likes-item'}
								underline={UNDERLINE.hover}
							>
								<UserAvatar user={user} />
								<span>{user.display_name || user.username}</span>
							</Link>
						);
					})
				) : (
					<p>No saves</p>
				)}
			</LoadMoreModal>
		);
	};

	const handleCount = useCallback(() => {
		dispatch(
			loadSavedBy(
				{story: storyId, ...DEFAULT_LIMIT, _start: currentPage * DEFAULT_LIMIT._limit},
				false,
				DEFAULT_OP.load_more
			)
		);
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, storyId]);

	useEffect(() => {
		if (storyId) {
			dispatch(loadSavedBy({story: storyId, ...DEFAULT_LIMIT}, true));
		}
	}, [dispatch, storyId]);
	return (
		<ConfirmModal
			isOpen={isOpen}
			title={title}
			renderFooter={false}
			content={renderContent()}
			onClose={onClose}
		/>
	);
}

SavedByDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	storyId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default SavedByDialog;
