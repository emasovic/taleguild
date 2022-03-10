import {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

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
	socket = null;

	handleEmit = (connection, data) => this.socket.emit(connection, data);

	init = () => {
		const {notificationsAddOne, data} = this.props;
		this.socket = io(process.env.REACT_APP_API_URL);

		this.handleEmit(SOCKET_EVENTS.userConnected, {username: data.username, id: data.id});

		this.socket.on(SOCKET_EVENTS.notifications, socketData => {
			notificationsAddOne(socketData);
		});
	};

	exit = () => {
		const {data} = this.props;
		this.handleEmit(SOCKET_EVENTS.userDisconnected, {
			username: data.username,
			id: data.id,
		});
		this.socket.close();
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
		const {data} = this.props;
		data && this.exit();
	}

	render() {
		return null;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RealTimeUpdates);
