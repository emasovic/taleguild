import React from 'react';
import PropTypes from 'prop-types';
import {DropdownItem} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';

import {NOTIFICATION_TYPES} from 'types/notifications';

import {selectNotification, updateNotification} from 'redux/notifications';

import Typography from 'components/widgets/typography/Typography';
import FromNow from 'components/widgets/date-time/FromNow';

import {ReactComponent as Coin} from 'images/coin.svg';
import {ReactComponent as Star} from 'images/star.svg';

import './Notifications.scss';

const CLASS = 'st-Notifications';

function NotificationItem({id, toggle}) {
	const dispatch = useDispatch();
	const notification = useSelector(state => selectNotification(state, id));

	const editNotification = () => {
		!notification.seen && dispatch(updateNotification({id, seen: true}));
	};

	const {data, created_at, type, seen} = notification;

	const message = notification.message;
	const sign = NOTIFICATION_TYPES.ITEM_BOUGHT === type ? '-' : '+';
	return (
		<DropdownItem
			active={!seen}
			onClick={editNotification}
			className={CLASS + '-item'}
			toggle={toggle}
		>
			<Typography component="p">{message}</Typography>
			<Typography component="p">
				<FromNow date={created_at} />
			</Typography>
			<div className={CLASS + '-item-rewards'}>
				{!!data?.points && (
					<Typography>
						<Star />
						<strong>
							{sign} {data?.points}
						</strong>
						&nbsp; XP
					</Typography>
				)}
				{!!data?.coins && (
					<Typography>
						<Coin />
						<strong>
							{sign} {data?.coins}
						</strong>
						&nbsp; coins
					</Typography>
				)}
			</div>
		</DropdownItem>
	);
}

NotificationItem.defaultProps = {
	toggle: undefined,
};

NotificationItem.propTypes = {
	id: PropTypes.number,
	toggle: PropTypes.func,
};

export default NotificationItem;
