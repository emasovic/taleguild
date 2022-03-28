import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_PAGINATION, DEFAULT_OP} from 'types/default';

import {loadSavedBy, selectSavedBy} from 'redux/savedBy';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from 'views/user/UserAvatar';
import Typography from 'components/widgets/typography/Typography';

function SavedByDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();
	const savedBy = useSelector(selectSavedBy);
	const {op, total} = useSelector(state => state.savedBy);

	const renderContent = () => {
		return (
			<LoadMore
				className={className + '-likes'}
				onLoadMore={() => handleLoadSavedBy(DEFAULT_OP.load_more, savedBy.length)}
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
				showItems={op[DEFAULT_OP.loading].success}
				shouldLoad={total > savedBy.length}
				isModal
				total={total}
				NoItemsComponent={() => <Typography>No saves</Typography>}
				id="storySavedBy"
			>
				{savedBy.map((item, key) => {
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
				})}
			</LoadMore>
		);
	};

	const handleLoadSavedBy = useCallback(
		(op, _start) => {
			storyId &&
				dispatch(
					loadSavedBy(
						{
							story: storyId,
							_sort: 'created_at:DESC',
							...DEFAULT_PAGINATION,
							_start,
						},
						op
					)
				);
		},
		[dispatch, storyId]
	);

	useEffect(() => handleLoadSavedBy(undefined, 0), [handleLoadSavedBy]);
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
	title: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	storyId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default SavedByDialog;
