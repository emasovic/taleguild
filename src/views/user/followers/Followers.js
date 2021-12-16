import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {selectFollowers, loadFollowers, createOrDeleteFollower} from 'redux/followers';
import {selectAuthUser} from 'redux/auth';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import UserAvatar from '../UserAvatar';

import './Followers.scss';

const CLASS = 'st-Followers';

export default function Followers({id}) {
	const dispatch = useDispatch();
	const followers = useSelector(selectFollowers);
	const {data} = useSelector(selectAuthUser);
	const {op, pages, total, currentPage} = useSelector(state => state.followers);

	const [isOpen, setIsOpen] = useState(false);

	const renderContent = () => {
		return (
			<LoadMoreModal
				className={CLASS + '-followers'}
				onLoadMore={() =>
					handleLoadFollwers(
						false,
						DEFAULT_OP.load_more,
						currentPage * DEFAULT_LIMIT._limit
					)
				}
				loading={op === DEFAULT_OP.load_more}
				shouldLoad={pages > currentPage}
				id="following"
			>
				{followers.length ? (
					followers.map((item, key) => {
						const {follower, user} = item;
						return (
							<Link
								underline={UNDERLINE.hover}
								to={goToUser(follower.username)}
								key={key}
								className={CLASS + '-followers-item'}
							>
								<UserAvatar user={follower} />
								<span>{follower.display_name || follower.username}</span>
								{data?.id === user.id && (
									<IconButton
										color={COLOR.secondary}
										onClick={e => handleFollow(e, item)}
									>
										Remove
									</IconButton>
								)}
							</Link>
						);
					})
				) : (
					<p>No followers</p>
				)}
			</LoadMoreModal>
		);
	};

	const handleFollow = (e, follower) => {
		e.preventDefault();
		dispatch(createOrDeleteFollower({follower, userId: id, followerId: data?.id}));
	};

	const handleLoadFollwers = useCallback(
		(count, op, _start) => {
			dispatch(loadFollowers({user: id, ...DEFAULT_LIMIT, _start}, count, op));
		},
		[dispatch, id]
	);

	useEffect(() => {
		if (id) {
			handleLoadFollwers(true, undefined, 0);
		}
	}, [dispatch, id, handleLoadFollwers]);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-info'} onClick={() => setIsOpen(true)}>
				<span>{op !== DEFAULT_OP.loading && total}</span>
				<span>Followers</span>
			</div>

			{isOpen && (
				<ConfirmModal
					id="followers"
					isOpen={isOpen}
					title="Followers"
					className={CLASS}
					renderFooter={false}
					content={renderContent()}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
}

Followers.propTypes = {
	id: PropTypes.number,
};
