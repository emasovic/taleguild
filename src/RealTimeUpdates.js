import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {socket} from 'config/web-sockets';

import {selectUser} from 'redux/user';
import {notificationsUpsertOne} from 'redux/notifications';

function RealTimeUpdates() {
	const dispatch = useDispatch();

	const {data} = useSelector(selectUser);

	useEffect(() => {
		if (data) {
			socket.on(data.id, data => {
				dispatch(notificationsUpsertOne(data));
			});
		}
	}, [dispatch, data]);

	return null;
}

export default RealTimeUpdates;
