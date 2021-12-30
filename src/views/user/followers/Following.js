import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {selectFollowing, loadFollowing, createOrDeleteFollowing} from 'redux/following';
import {selectAuthUser} from 'redux/auth';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Typography from 'components/widgets/typography/Typography';

import UserAvatar from '../UserAvatar';

import './Followers.scss';

const CLASS = 'st-Followers';

export default function Following({id}) {
	const dispatch = useDispatch();
	const following = useSelector(selectFollowing);
	const {data} = useSelector(selectAuthUser);
	const {op, total} = useSelector(state => state.following);

	const [isOpen, setIsOpen] = useState(false);

	const renderContent = () => {
		return (
			<LoadMore
				className={CLASS + '-followers'}
				onLoadMore={() =>
					handleLoadFollowing(false, DEFAULT_OP.load_more, following.length)
				}
				loading={[DEFAULT_OP.loading, DEFAULT_OP.load_more].includes(op)}
				showItems={op !== DEFAULT_OP.loading}
				shouldLoad={total > following.length}
				isModal
				total={total}
				NoItemsComponent={() => <Typography>No following</Typography>}
				id="following"
			>
				{following.map((item, key) => {
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
				})}
			</LoadMore>
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
	const followersClasses = classNames(CLASS + '-info', !data && CLASS + ' disabled');
	return (
		<div className={CLASS}>
			<div className={followersClasses} onClick={() => setIsOpen(true)}>
				<Typography>{op !== DEFAULT_OP.loading && total}</Typography>
				<Typography>Following</Typography>
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
