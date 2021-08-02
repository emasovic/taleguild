import React from 'react';

import Notifications from './Notifications';

import './Notifications.scss';

const CLASS = 'st-Notifications';

export default function NotificationsPage() {
	return (
		<div className={CLASS + '-page'}>
			<Notifications isPage />;
		</div>
	);
}
