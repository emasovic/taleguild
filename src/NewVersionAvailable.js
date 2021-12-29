import IconButton from 'components/widgets/button/IconButton';
import React, {useEffect, useState} from 'react';

import * as serviceWorker from './serviceWorker';

export default function NewVersionAvailable() {
	const [showReload, setShowReload] = useState(false);
	const [waitingWorker, setWaitingWorker] = useState(null);

	const onSWUpdate = registration => {
		setShowReload(true);
		setWaitingWorker(registration.waiting);
	};

	useEffect(() => {
		serviceWorker.register({onUpdate: onSWUpdate});
	}, []);

	const reloadPage = () => {
		waitingWorker?.postMessage({type: 'SKIP_WAITING'});
		setShowReload(false);
		window.location.reload(true);
	};
	return <div>{showReload && <IconButton onClick={reloadPage}>upgrade</IconButton>}</div>;
}
