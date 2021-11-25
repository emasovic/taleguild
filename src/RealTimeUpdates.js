import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {socket} from 'config/web-sockets';

import {selectAuthUser} from 'redux/auth';
import {notificationsAddOne} from 'redux/notifications';

function RealTimeUpdates() {
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);

	useEffect(() => {
		if (data) {
			socket.on(data.id, data => {
				dispatch(notificationsAddOne(data));
			});
		}
	}, [dispatch, data]);

	return null;
}

export default RealTimeUpdates;
