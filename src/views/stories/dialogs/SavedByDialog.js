import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_OP} from 'types/default';

import {loadSavedBy, selectSavedBy} from 'redux/savedBy';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import Loader from 'components/widgets/loader/Loader';

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
		if (op === DEFAULT_OP.loading) {
			return <Loader />;
		}
		return (
			<LoadMoreModal
				className={className + '-likes'}
				onLoadMore={handleCount}
				loading={op === DEFAULT_OP.load_more}
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
				{story: storyId, _start: currentPage * 10, _limit: 10},
				false,
				DEFAULT_OP.load_more
			)
		);
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, storyId]);

	useEffect(() => {
		if (storyId) {
			dispatch(loadSavedBy({story: storyId, _start: 0, _limit: 10}, true));
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
