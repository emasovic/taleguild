import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Badge} from 'reactstrap';
import {useHistory} from 'react-router';

import {NOTIFICATIONS} from 'lib/routes';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import {FONT_WEIGHT, TEXT_COLORS, TEXT_CURSORS, TEXT_TRASFORM} from 'types/typography';
import FA from 'types/font_awesome';

import {loadNotifications, updateNotifications, selectNotificationIds} from 'redux/notifications';
import {selectAuthUser} from 'redux/auth';

import FaIcon from 'components/widgets/fa-icon/FaIcon';
import DropdownButton from 'components/widgets/button/DropdownButton';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import Typography from 'components/widgets/typography/Typography';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import NotificationItem from './NotificationItem';

import './Notifications.scss';

const CLASS = 'st-Notifications';

export default function Notifications({isPage, isMobile}) {
	const dispatch = useDispatch();
	const {push} = useHistory();
	const {data} = useSelector(selectAuthUser);
	const userId = data?.id;
	const {unseen, currentPage, pages, op} = useSelector(state => state.notifications);
	const notificationIds = useSelector(selectNotificationIds);
	const unseenBool = !!unseen;

	const handleLoadNotifications = useCallback(
		(count, op, _start) =>
			userId &&
			dispatch(
				loadNotifications(
					{
						receiver: userId,
						_sort: 'created_at:DESC',
						...DEFAULT_LIMIT,
						_start,
					},
					count,
					op
				)
			),
		[dispatch, userId]
	);

	const handleMarkAllAsRead = () => dispatch(updateNotifications({markAllAsRead: true}));

	useEffect(() => handleLoadNotifications(true, undefined, 0), [handleLoadNotifications]);

	const header = (
		<div className={CLASS + '-notifications'}>
			<Typography textTransform={TEXT_TRASFORM.uppercase} fontWeight={FONT_WEIGHT.semiBold}>
				Notifications
			</Typography>
			<Typography
				disabled={!unseenBool}
				onClick={handleMarkAllAsRead}
				color={TEXT_COLORS.buttonPrimary}
				fontWeight={FONT_WEIGHT.bold}
				cursor={TEXT_CURSORS.pointer}
			>
				Mark all as read
			</Typography>
		</div>
	);

	if (isPage) {
		return (
			<MobileWrapper>
				<LoadMore
					id="notificationPage"
					onLoadMore={() =>
						handleLoadNotifications(false, DEFAULT_OP.load_more, notificationIds.length)
					}
					shouldLoad={pages > currentPage}
					loading={[DEFAULT_OP.loading, DEFAULT_OP.load_more].includes(op)}
					showItems={op !== DEFAULT_OP.loading}
				>
					{header}
					{!!notificationIds.length &&
						notificationIds.map(i => <NotificationItem key={i} id={i} toggle={null} />)}
				</LoadMore>
			</MobileWrapper>
		);
	}

	const toggleItem = (
		<div className={CLASS + '-bell'}>
			<FaIcon icon={FA.bell} />
			{!!unseen && (
				<sup>
					<Badge>{unseen}</Badge>
				</sup>
			)}
		</div>
	);

	const dropDownProps = {};

	if (isMobile) {
		dropDownProps.isOpen = false;
		dropDownProps.onClick = () => push(NOTIFICATIONS);
	}

	return (
		<DropdownButton
			toggleItem={toggleItem}
			className={CLASS}
			outline={false}
			{...dropDownProps}
		>
			{header}
			<LoadMoreModal
				id="notifications"
				onLoadMore={() =>
					handleLoadNotifications(false, DEFAULT_OP.load_more, notificationIds.length)
				}
				shouldLoad={pages > currentPage}
				loading={op === DEFAULT_OP.load_more}
			>
				{!!notificationIds.length &&
					notificationIds.map(i => <NotificationItem key={i} id={i} />)}
			</LoadMoreModal>
		</DropdownButton>
	);
}

Notifications.propTypes = {
	isPage: PropTypes.bool,
	isMobile: PropTypes.bool,
};
