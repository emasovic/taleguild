import {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {socket} from 'config/web-sockets';

import {selectAuthUser} from 'redux/auth';
import {notificationsAddOne} from 'redux/notifications';

const SOCKET_EVENTS = {
	connect: 'connect',
	disconnect: 'disconnect',
	userConnected: 'userConnected',
	userDisconnected: 'userDisconnected',
	notifications: 'notifications',
};

const mapStateToProps = state => {
	const {data} = selectAuthUser(state);
	return {
		data,
	};
};

const mapDispatchToProps = {
	notificationsAddOne,
};

class RealTimeUpdates extends PureComponent {
	static propTypes = {
		data: PropTypes.object,
		notificationsAddOne: PropTypes.func.isRequired,
	};

	initialized = false;

	handleEmit = (connection, data) => socket.emit(connection, data);

	init = () => {
		const {notificationsAddOne, data} = this.props;
		socket.on(SOCKET_EVENTS.connect, () =>
			this.handleEmit(SOCKET_EVENTS.userConnected, {username: data.username, id: data.id})
		);
		socket.on(SOCKET_EVENTS.notifications, socketData => {
			notificationsAddOne(socketData);
		});
	};

	exit = () => {
		const {data} = this.props;
		data &&
			socket.on(SOCKET_EVENTS.disconnect, () =>
				this.handleEmit(SOCKET_EVENTS.userDisconnected, {
					username: data.username,
					id: data.id,
				})
			);
		socket.close();
	};

	componentDidMount() {
		const {data} = this.props;
		if (data) {
			this.init();
			this.initialized = true;
		}
	}

	componentDidUpdate() {
		const {data} = this.props;
		if (data && !this.initialized) {
			this.init();
			this.initialized = true;
		}
	}

	componentWillUnmount() {
		this.exit();
	}

	render() {
		return null;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeUpdates);
