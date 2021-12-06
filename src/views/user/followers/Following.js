import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';

import {selectFollowing, loadFollowing, createOrDeleteFollowing} from 'redux/following';
import {selectAuthUser} from 'redux/auth';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from '../UserAvatar';

import './Followers.scss';

const CLASS = 'st-Followers';

export default function Following({id}) {
	const dispatch = useDispatch();
	const {following, total, loading, user, pages} = useSelector(
		state => ({
			following: selectFollowing(state, id),
			user: selectAuthUser(state),
			loading: state.following.loading,
			pages: state.following.pages,
			total: state.following.total,
		}),
		shallowEqual
	);

	const {data} = user;

	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const renderContent = () => {
		return (
			<LoadMoreModal
				className={CLASS + '-followers'}
				onLoadMore={handleCount}
				loading={loading}
				shouldLoad={pages > currentPage}
				id="following"
			>
				{following.length ? (
					following.map((item, key) => {
						const {follower, user} = item;

						return (
							<Link
								underline={UNDERLINE.hover}
								to={goToUser(user.username)}
								key={key}
								className={CLASS + '-followers-item'}
							>
								<UserAvatar user={user} />
								<span>{user.display_name || user.username}</span>
								{data && data.id === follower.id && (
									<IconButton
										color={COLOR.secondary}
										onClick={e => handleFollow(e, item)}
									>
										Unfollow
									</IconButton>
								)}
							</Link>
						);
					})
				) : (
					<p>No following</p>
				)}
			</LoadMoreModal>
		);
	};

	const handleFollow = (e, follower) => {
		e.preventDefault();
		dispatch(createOrDeleteFollowing(follower, id, data && data.id));
	};

	const handleCount = useCallback(() => {
		dispatch(loadFollowing({follower: id, _start: currentPage * 10, _limit: 10}, false));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, id]);

	useEffect(() => {
		if (id) {
			dispatch(loadFollowing({follower: id, _start: 0, _limit: 10}, true));
		}
	}, [dispatch, id]);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-info'} onClick={() => setIsOpen(true)}>
				<span>{total}</span>
				<span>Following</span>
			</div>

			{isOpen && (
				<ConfirmModal
					isOpen={isOpen}
					className={CLASS}
					title="Following"
					renderFooter={false}
					content={renderContent()}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
}

Following.propTypes = {
	id: PropTypes.number,
};
