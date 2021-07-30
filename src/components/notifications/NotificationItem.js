import React from 'react';
import PropTypes from 'prop-types';
import {DropdownItem} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';

import {selectNotification, updateNotification} from 'redux/notifications';

import Typography from 'components/widgets/typography/Typography';
import FromNow from 'components/widgets/date-time/FromNow';

import {ReactComponent as Coin} from 'images/coin.svg';
import {ReactComponent as Star} from 'images/star.svg';

import './Notifications.scss';

const CLASS = 'st-Notifications';

function NotificationItem({id}) {
	const dispatch = useDispatch();
	const notification = useSelector(state => selectNotification(state, id));

	const editNotification = () => {
		!notification.seen && dispatch(updateNotification({id, seen: true}));
	};

	const {reward, created_at, seen} = notification;

	const message = notification.message || reward?.description;
	return (
		<DropdownItem active={!seen} onClick={() => editNotification()} className={CLASS + '-item'}>
			<Typography component="p">{message}</Typography>
			<Typography component="p">
				<FromNow date={created_at} />
			</Typography>
			<div className={CLASS + '-item-rewards'}>
				{!!reward?.points && (
					<Typography>
						<strong>+ {reward?.points}</strong> &nbsp; experience
						<Star />
					</Typography>
				)}
				{!!reward?.coins && (
					<Typography>
						<strong>+ {reward?.coins}</strong> &nbsp; coins
						<Coin />
					</Typography>
				)}
			</div>
		</DropdownItem>
	);
}

NotificationItem.propTypes = {
	id: PropTypes.number,
};

export default NotificationItem;
