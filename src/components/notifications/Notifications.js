import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Badge} from 'reactstrap';
import {useHistory} from 'react-router';

import {NOTIFICATIONS} from 'lib/routes';

import {DEFAULT_PAGINATION, DEFAULT_OP} from 'types/default';
import {FONT_WEIGHT, TEXT_COLORS, TEXT_CURSORS, TEXT_TRASFORM} from 'types/typography';
import {NOTIFICATION_ACTIONS} from 'types/notifications';
import FA from 'types/font_awesome';

import {loadNotifications, updateNotifications, selectNotificationIds} from 'redux/notifications';
import {selectAuthUser} from 'redux/auth';

import FaIcon from 'components/widgets/fa-icon/FaIcon';
import DropdownButton from 'components/widgets/button/DropdownButton';
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
	const {totalNew, total, op} = useSelector(state => state.notifications);
	const notificationIds = useSelector(selectNotificationIds);

	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		totalNew && dispatch(updateNotifications({action: NOTIFICATION_ACTIONS.markAllNotNew}));
		setIsOpen(prevState => !prevState);
	};

	const handleLoadNotifications = useCallback(
		(op, start = 0) =>
			userId &&
			dispatch(
				loadNotifications(
					{
						filters: {
							receiver: userId,
						},
						sort: ['createdAt:desc'],
						pagination: {
							...DEFAULT_PAGINATION,
							start: DEFAULT_PAGINATION.start || start,
						},
					},
					op
				)
			),
		[dispatch, userId]
	);

	const handleMarkAllAsRead = () =>
		dispatch(updateNotifications({action: NOTIFICATION_ACTIONS.markAllRead}));

	useEffect(() => handleLoadNotifications(), [handleLoadNotifications]);

	const header = (
		<div className={CLASS + '-notifications'}>
			<Typography textTransform={TEXT_TRASFORM.uppercase} fontWeight={FONT_WEIGHT.semiBold}>
				Notifications
			</Typography>
			<Typography
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
						handleLoadNotifications(DEFAULT_OP.load_more, notificationIds.length)
					}
					loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
					showItems={op[DEFAULT_OP.loading].success}
					shouldLoad={total > notificationIds.length}
					total={total}
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
			{!!totalNew && (
				<sup>
					<Badge>{totalNew}</Badge>
				</sup>
			)}
		</div>
	);

	const dropDownProps = {};

	if (isMobile) {
		dropDownProps.isOpen = false;
		dropDownProps.onClick = () => {
			totalNew && dispatch(updateNotifications({action: NOTIFICATION_ACTIONS.markAllNotNew}));
			push(NOTIFICATIONS);
		};
	}

	return (
		<DropdownButton
			toggleItem={toggleItem}
			isOpen={isOpen}
			toggle={toggle}
			className={CLASS}
			outline={false}
			{...dropDownProps}
		>
			{isOpen && !isMobile && (
				<>
					{header}
					<LoadMore
						id="notifications"
						onLoadMore={() =>
							handleLoadNotifications(DEFAULT_OP.load_more, notificationIds.length)
						}
						loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
						showItems={op[DEFAULT_OP.loading].success}
						shouldLoad={total > notificationIds.length}
						isModal
						total={total}
					>
						{!!notificationIds.length &&
							notificationIds.map(i => <NotificationItem key={i} id={i} />)}
					</LoadMore>
				</>
			)}
		</DropdownButton>
	);
}

Notifications.propTypes = {
	isPage: PropTypes.bool,
	isMobile: PropTypes.bool,
};
