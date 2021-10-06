import React from 'react';
import PropTypes from 'prop-types';

import helmet from 'images/guildator/helmet/hat_viking-helmet.svg';

import head from 'images/guildator/head/head.svg';

import body from 'images/guildator/body/body.svg';

import leftWeapon from 'images/guildator/weapon/weapon_shield.svg';

import rightWeapon from 'images/guildator/weapon/weapon_sword-small.svg';

import './Guildator.scss';

const CLASS = 'st-Guildator';

export default function Guildator({helmet, head, body, leftWeapon, rightWeapon}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-character'}>
				<img src={helmet} alt="helmet" className={CLASS + '-character-helmet'} />
				<img src={head} alt="head" className={CLASS + '-character-head'} />
				<img src={body} alt="body" className={CLASS + '-character-body'} />
				<img
					src={leftWeapon}
					alt="left_weapon"
					className={CLASS + '-character-left_weapon'}
				/>
				<img
					src={rightWeapon}
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
	leftWeapon,
	rightWeapon,
};

Guildator.propTypes = {
	helmet: PropTypes.string,
	head: PropTypes.string,
	body: PropTypes.string,
	leftWeapon: PropTypes.string,
	rightWeapon: PropTypes.string,
};
