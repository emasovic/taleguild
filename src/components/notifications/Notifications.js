import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Badge} from 'reactstrap';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import FA from 'types/font_awesome';

import {loadNotifications, selectNotificationIds} from 'redux/notifications';
import {selectUser} from 'redux/user';

import FaIcon from 'components/widgets/fa-icon/FaIcon';
import DropdownButton from 'components/widgets/button/DropdownButton';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import NotificationItem from './NotificationItem';

import './Notifications.scss';
import Typography from 'components/widgets/typography/Typography';

const CLASS = 'st-Notifications';

export default function Notifications({isPage, isMobile}) {
	const dispatch = useDispatch();
	const {data} = useSelector(selectUser);
	const {unseen, currentPage, pages, op} = useSelector(state => state.notifications);
	const notificationIds = useSelector(selectNotificationIds);

	const getNotifications = useCallback(() => {
		if (data) {
			dispatch(
				loadNotifications(
					{
						reciever: data.id,
						_limit: 10,
						_start: currentPage * 10,
						_sort: 'created_at:DESC',
					},
					false,
					DEFAULT_OP.load_more
				)
			);
		}
	}, [currentPage, data, dispatch]);

	useEffect(() => {
		if (data) {
			dispatch(
				loadNotifications(
					{reciever: data.id, _sort: 'created_at:DESC', ...DEFAULT_LIMIT},
					true
				)
			);
		}
	}, [data, dispatch]);

	if (isPage) {
		return (
			<LoadMore
				id="notifications-page"
				onLoadMore={getNotifications}
				shouldLoad={pages > currentPage}
				loading={op === DEFAULT_OP.load_more}
			>
				<Typography className={CLASS + '-notifications'}>Notifications</Typography>
				{!!notificationIds.length &&
					notificationIds.map(i => <NotificationItem key={i} id={i} />)}
			</LoadMore>
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
		dropDownProps.toggle = undefined;
	}

	return (
		<DropdownButton
			toggleItem={toggleItem}
			className={CLASS}
			outline={false}
			{...dropDownProps}
		>
			<LoadMoreModal
				id="notifications"
				onLoadMore={getNotifications}
				shouldLoad={pages > currentPage}
				loading={op === DEFAULT_OP.load_more}
			>
				<Typography className={CLASS + '-notifications'}>Notifications</Typography>
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
