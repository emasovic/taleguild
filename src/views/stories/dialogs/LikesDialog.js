import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_OP} from 'types/default';

import {loadLikes, selectLikes} from 'redux/likes';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from 'views/user/UserAvatar';
function LikesDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();
	const {likes, op, pages} = useSelector(
		state => ({
			likes: selectLikes(state),
			op: state.likes.op,
			pages: state.likes.pages,
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
				id="storyLikes"
			>
				{likes.length ? (
					likes.map((item, key) => {
						const {user} = item;
						return (
							<Link
								to={goToUser(user.username)}
								key={key}
								underline={UNDERLINE.hover}
								className={className + '-likes-item'}
							>
								<UserAvatar user={user} />
								<span>{user.display_name || user.username}</span>
							</Link>
						);
					})
				) : (
					<p>No likes</p>
				)}
			</LoadMoreModal>
		);
	};

	const handleCount = useCallback(() => {
		dispatch(
			loadLikes(
				{story: storyId, _start: currentPage * 10, _limit: 10},
				false,
				DEFAULT_OP.load_more
			)
		);
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, storyId]);

	useEffect(() => {
		if (storyId) {
			dispatch(loadLikes({story: storyId, _start: 0, _limit: 10}, true));
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

LikesDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	storyId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default LikesDialog;
