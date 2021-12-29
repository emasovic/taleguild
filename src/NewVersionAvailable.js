import React, {useEffect, useState} from 'react';

import {ICON_COMPONENTS} from 'types/icons';

import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';

import * as serviceWorker from './serviceWorker';

import './NewVersionAvailable.scss';

const CLASS = 'st-NewVersionAvailable';

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

	return (
		showReload && (
			<PagePlaceholder
				className={CLASS}
				IconComponent={ICON_COMPONENTS.LogoGrey}
				title="New version is available"
				subtitle="Please click on upgrade button"
				buttonLabel="Upgrade"
				buttonProps={{onClick: reloadPage, tag: undefined, to: undefined}}
			/>
		)
	);
}
