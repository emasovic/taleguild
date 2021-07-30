import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Badge} from 'reactstrap';

import {DEFAULT_OP} from 'types/default';
import FA from 'types/font_awesome';

import {loadNotifications, selectNotificationIds} from 'redux/notifications';
import {selectUser} from 'redux/user';

import FaIcon from 'components/widgets/fa-icon/FaIcon';
import DropdownButton from 'components/widgets/button/DropdownButton';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';

import NotificationItem from './NotificationItem';

import './Notifications.scss';

const CLASS = 'st-Notifications';

export default function Notifications() {
	const dispatch = useDispatch();
	const {data} = useSelector(selectUser);
	const {unseen, currentPage, pages, op} = useSelector(state => state.notifications);
	const notificationIds = useSelector(selectNotificationIds);

	const getNotifications = useCallback(
		(criteria, count, op = DEFAULT_OP.load_more) => {
			dispatch(
				loadNotifications(
					{reciever: data.id, _limit: 10, _start: currentPage * 10, ...criteria},
					count,
					op
				)
			);
		},
		[currentPage, data, dispatch]
	);

	useEffect(() => {
		getNotifications({_start: 0}, true, DEFAULT_OP.loading);
	}, [getNotifications]);

	const toggleItem = (
		<div className={CLASS + '-bell'}>
			<FaIcon icon={FA.bell} />
			<sup>
				<Badge>{unseen}</Badge>
			</sup>
		</div>
	);

	return (
		<DropdownButton toggleItem={toggleItem} className={CLASS} outline={false}>
			<LoadMoreModal
				id="notifications"
				onLoadMore={getNotifications}
				shouldLoad={pages > currentPage}
				loading={op === DEFAULT_OP.load_more}
			>
				{notificationIds.length
					? notificationIds.map(i => <NotificationItem key={i} id={i} />)
					: 'No notifications'}
			</LoadMoreModal>
		</DropdownButton>
	);
}
