import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {socket} from 'config/web-sockets';

import {selectUser} from 'redux/user';

function Notifications(props) {
	const {data} = useSelector(selectUser);

	useEffect(() => {
		if (data) {
			socket.on(data.id, data => {
				// eslint-disable-next-line no-console
				console.log(data);
			});
		}
	}, [data]);

	return <div></div>;
}

export default Notifications;
