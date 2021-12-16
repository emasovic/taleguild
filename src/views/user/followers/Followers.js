import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import PropTypes from 'prop-types';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';
import {DEFAULT_LIMIT} from 'types/default';

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
	const {followers, total, loading, user, pages} = useSelector(
		state => ({
			followers: selectFollowers(state, id),
			user: selectAuthUser(state),
			loading: state.followers.loading,
			pages: state.followers.pages,
			total: state.followers.total,
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
								{data && data.id === user.id && (
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
		dispatch(createOrDeleteFollower(follower, id, data && data.id));
	};

	const handleCount = useCallback(() => {
		dispatch(
			loadFollowers(
				{user: id, ...DEFAULT_LIMIT, _start: currentPage * DEFAULT_LIMIT._limit},
				false
			)
		);
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, id]);

	useEffect(() => {
		if (id) {
			dispatch(loadFollowers({user: id, ...DEFAULT_LIMIT}, true));
		}
	}, [dispatch, id]);

	return (
		<div className={CLASS}>
			<div className={CLASS + '-info'} onClick={() => setIsOpen(true)}>
				<span>{total}</span>
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
