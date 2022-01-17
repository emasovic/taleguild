import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {loadLikes, selectLikes} from 'redux/likes';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from 'views/user/UserAvatar';
import Typography from 'components/widgets/typography/Typography';
function LikesDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();
	const likes = useSelector(selectLikes);
	const {op, total} = useSelector(state => state.likes);

	const renderContent = () => {
		return (
			<LoadMore
				className={className + '-likes'}
				onLoadMore={() => handleLoadLikes(false, DEFAULT_OP.load_more, likes.length)}
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
				showItems={op[DEFAULT_OP.loading].success}
				shouldLoad={total > likes.length}
				isModal
				total={total}
				NoItemsComponent={() => <Typography>No likes</Typography>}
				id="storyLikes"
			>
				{likes.map((item, key) => {
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
				})}
			</LoadMore>
		);
	};

	const handleLoadLikes = useCallback(
		(count, op, _start) => {
			storyId &&
				dispatch(
					loadLikes(
						{
							story: storyId,
							_sort: 'created_at:DESC',
							...DEFAULT_LIMIT,
							_start,
						},
						count,
						op
					)
				);
		},
		[dispatch, storyId]
	);

	useEffect(() => handleLoadLikes(true, undefined, 0), [handleLoadLikes]);
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
