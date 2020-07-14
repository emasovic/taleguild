import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';

import {selectFollowers, loadFollowers, createOrDeleteFollower} from 'redux/followers';
import {selectUser} from 'redux/user';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import IconButton from 'components/widgets/button/IconButton';

import UserAvatar from '../UserAvatar';

import './Followers.scss';

const CLASS = 'st-Followers';

export default function Followers({id}) {
	const dispatch = useDispatch();
	const {followers, total, loading, user, pages} = useSelector(state => ({
		followers: selectFollowers(state, id),
		user: selectUser(state),
		loading: state.followers.loading,
		pages: state.followers.pages,
		total: state.followers.total,
	}));

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
								to={goToUser(follower.id)}
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
		dispatch(loadFollowers({user: id, _start: currentPage * 10, _limit: 10}, false));
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, id]);

	useEffect(() => {
		if (id) {
			dispatch(loadFollowers({user: id, _start: 0, _limit: 10}, true));
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
