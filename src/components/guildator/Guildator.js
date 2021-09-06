import React from 'react';
import PropTypes from 'prop-types';

import helmet from 'images/guildator/helmet/hat_viking-helmet.png';

import head from 'images/guildator/head/head.png';

import body from 'images/guildator/body/body1.png';

import weapon from 'images/guildator/weapon/weapon_wizard-stick.svg';

import './Guildator.scss';

const CLASS = 'st-Guildator';

export default function Guildator({helmet, head, body, weapon}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-character'}>
				<img src={helmet} alt="helmet" className={CLASS + '-character-helmet'} />
				<img src={head} alt="head" className={CLASS + '-character-head'} />
				<img src={body} alt="body" className={CLASS + '-character-body'} />
				<img src={weapon} alt="weapon" className={CLASS + '-character-weapon'} />
			</div>
		</div>
	);
}

Guildator.defaultProps = {
	helmet,
	head,
	body,
	weapon,
};

Guildator.propTypes = {
	helmet: PropTypes.string,
	head: PropTypes.string,
	body: PropTypes.string,
	weapon: PropTypes.string,
};
