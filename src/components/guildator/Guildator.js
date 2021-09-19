import React from 'react';
import PropTypes from 'prop-types';

import helmet from 'images/guildator/helmet/hat_viking-helmet.png';

import head from 'images/guildator/head/head.png';

import body from 'images/guildator/body/body1.png';

import left_weapon from 'images/guildator/weapon/weapon_wizard-stick.svg';

import right_weapon from 'images/guildator/weapon/weapon_wizard-stick.svg';

import './Guildator.scss';

const CLASS = 'st-Guildator';

export default function Guildator({helmet, head, body, left_weapon, right_weapon}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-character'}>
				<img src={helmet} alt="helmet" className={CLASS + '-character-helmet'} />
				<img src={head} alt="head" className={CLASS + '-character-head'} />
				<img src={body} alt="body" className={CLASS + '-character-body'} />
				<img
					src={left_weapon}
					alt="left_weapon"
					className={CLASS + '-character-left_weapon'}
				/>
				<img
					src={right_weapon}
					alt="right_weapon"
					className={CLASS + '-character-right_weapon'}
				/>
			</div>
		</div>
	);
}

Guildator.defaultProps = {
	helmet,
	head,
	body,
	left_weapon,
	right_weapon,
};

Guildator.propTypes = {
	helmet: PropTypes.string,
	head: PropTypes.string,
	body: PropTypes.string,
	left_weapon: PropTypes.string,
	right_weapon: PropTypes.string,
};
