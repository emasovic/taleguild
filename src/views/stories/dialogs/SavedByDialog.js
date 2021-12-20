import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

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
				onLoadMore={() => handleLoadSavedBy(false, DEFAULT_OP.load_more, savedBy.length)}
				loading={[DEFAULT_OP.loading, DEFAULT_OP.load_more].includes(op)}
				showItems={op !== DEFAULT_OP.loading}
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
		(count, op, _start) => {
			storyId &&
				dispatch(
					loadSavedBy(
						{
							story: storyId,
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

	useEffect(() => handleLoadSavedBy(true, undefined, 0), [handleLoadSavedBy]);
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
