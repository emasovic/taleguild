import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Badge} from 'reactstrap';
import {useHistory} from 'react-router';

import {NOTIFICATIONS} from 'lib/routes';

import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import FA from 'types/font_awesome';

import {loadNotifications, selectNotificationIds} from 'redux/notifications';
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
			<MobileWrapper>
				<LoadMore
					id="notifications-page"
					onLoadMore={getNotifications}
					shouldLoad={pages > currentPage}
					loading={op === DEFAULT_OP.load_more}
				>
					<Typography className={CLASS + '-notifications'}>Notifications</Typography>
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
			<Typography className={CLASS + '-notifications'}>Notifications</Typography>
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
