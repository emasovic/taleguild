import React from 'react';

import {HOME} from 'lib/routes';

import IconButton from 'components/widgets/button/IconButton';

import './NotFound.scss';

const CLASS = 'st-NotFound';

export default function NotFound() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-error'}>
				<div className={CLASS + '-error-404'}>
					<h1>
						4<span></span>4
					</h1>
				</div>
				<h2>Stranica nije pronadjena</h2>

				<IconButton href={HOME}>Nazad na početnu</IconButton>
			</div>
		</div>
	);
}
