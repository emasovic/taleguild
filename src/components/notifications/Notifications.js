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

	const getNotifications = useCallback(() => {
		if (userId) {
			dispatch(
				loadNotifications(
					{
						receiver: userId,
						_limit: DEFAULT_LIMIT._limit,
						_start: currentPage * DEFAULT_LIMIT._limit,
						_sort: 'created_at:DESC',
					},
					false,
					DEFAULT_OP.load_more
				)
			);
		}
	}, [currentPage, userId, dispatch]);

	const handleMarkAllAsRead = () => dispatch(updateNotifications({markAllAsRead: true}));

	useEffect(() => {
		if (userId) {
			dispatch(
				loadNotifications(
					{receiver: userId, _sort: 'created_at:DESC', ...DEFAULT_LIMIT},
					true
				)
			);
		}
	}, [userId, dispatch]);

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
					id="notifications-page"
					onLoadMore={getNotifications}
					shouldLoad={pages > currentPage}
					loading={op === DEFAULT_OP.load_more}
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
				onLoadMore={getNotifications}
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
