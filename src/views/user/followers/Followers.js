import React, {useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {goToUser} from 'lib/routes';

import {COLOR} from 'types/button';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {selectFollowers, loadFollowers, createOrDeleteFollower} from 'redux/followers';
import {selectAuthUser} from 'redux/auth';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Typography from 'components/widgets/typography/Typography';

import UserAvatar from '../UserAvatar';

import './Followers.scss';

const CLASS = 'st-Followers';

export default function Followers({id}) {
	const dispatch = useDispatch();
	const followers = useSelector(selectFollowers);
	const {data} = useSelector(selectAuthUser);
	const {op, total} = useSelector(state => state.followers);

	const [isOpen, setIsOpen] = useState(false);

	const renderContent = () => {
		return (
			<LoadMore
				className={CLASS + '-followers'}
				onLoadMore={() => handleLoadFollwers(false, DEFAULT_OP.load_more, followers.length)}
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
				showItems={op[DEFAULT_OP.loading].success}
				shouldLoad={total > followers.length}
				isModal
				total={total}
				NoItemsComponent={() => <Typography>No followers</Typography>}
				id="followers"
			>
				{followers.map((item, key) => {
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
				})}
			</LoadMore>
		);
	};

	const handleFollow = (e, follower) => {
		e.preventDefault();
		dispatch(createOrDeleteFollower({follower, userId: id, followerId: data?.id}));
	};

	const handleLoadFollwers = useCallback(
		(count, op, _start) => {
			dispatch(
				loadFollowers(
					{user: id, ...DEFAULT_LIMIT, _sort: 'created_at:DESC', _start},
					count,
					op
				)
			);
		},
		[dispatch, id]
	);

	useEffect(() => {
		if (id) {
			handleLoadFollwers(true, undefined, 0);
		}
	}, [dispatch, id, handleLoadFollwers]);

	const followersClasses = classNames(CLASS + '-info', !data && CLASS + ' disabled');
	return (
		<div className={CLASS}>
			<div className={followersClasses} onClick={() => setIsOpen(true)}>
				<Typography>{!op[DEFAULT_OP.loading].loading && total}</Typography>
				<Typography>Followers</Typography>
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
