import React from 'react';

import {HOME} from 'lib/routes';

import IconButton from 'components/widgets/button/IconButton';

import {ReactComponent as Trees} from 'images/trees.svg';

import './NotFound.scss';

const CLASS = 'st-NotFound';

export default function NotFound() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-trees'}>
				<Trees />
			</div>

			<div className={CLASS + '-error'}>
				<span>404</span>
				<span>You got lost in the woods.</span>
				<span>
					Don’t worry, our wizard will tell you path where you can find what you are
					looking for.
				</span>
				<div>
					<IconButton href={HOME}>Back to guild</IconButton>
				</div>
			</div>
		</div>
	);
}
