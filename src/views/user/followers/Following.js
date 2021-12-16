import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

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
	const following = useSelector(selectFollowing);
	const {data} = useSelector(selectAuthUser);
	const {op, pages, total, currentPage} = useSelector(state => state.following);

	const [isOpen, setIsOpen] = useState(false);

	const renderContent = () => {
		return (
			<LoadMoreModal
				className={CLASS + '-followers'}
				onLoadMore={() =>
					handleLoadFollowing(
						false,
						DEFAULT_OP.load_more,
						currentPage * DEFAULT_LIMIT._limit
					)
				}
				loading={op === DEFAULT_OP.load_more}
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
		dispatch(createOrDeleteFollowing({follower, userId: id, followerId: data.id}));
	};

	const handleLoadFollowing = useCallback(
		(count, op, _start) => {
			dispatch(loadFollowing({follower: id, ...DEFAULT_LIMIT, _start}, count, op));
		},
		[dispatch, id]
	);

	useEffect(() => {
		if (id) {
			handleLoadFollowing(true, undefined, 0);
		}
	}, [dispatch, id, handleLoadFollowing]);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-info'} onClick={() => setIsOpen(true)}>
				<span>{op !== DEFAULT_OP.loading && total}</span>
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
