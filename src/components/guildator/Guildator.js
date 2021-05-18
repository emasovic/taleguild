import React from 'react';

import head from 'images/guildator/head/head.svg';

import hair from 'images/guildator/head/hair.png';

import body from 'images/guildator/body/torso.svg';
import left from 'images/guildator/body/left.svg';
import right from 'images/guildator/body/right.svg';

import spear from 'images/guildator/weapon/weapon_wizard-stick.svg';

import hemlet from 'images/guildator/helmet/hat_viking-helmet.svg';

import './Guildator.scss';

const CLASS = 'st-Guildator';

export default function Guildator() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-character'}>
				<img src={hemlet} alt="hemlet" className={CLASS + '-character-helmet'} />
				<img src={hair} alt="hair" className={CLASS + '-character-hair'} />
				<img src={head} alt="head" className={CLASS + '-character-head'} />
				<img src={body} alt="body" className={CLASS + '-character-body'} />
				<img src={left} alt="left" className={CLASS + '-character-left'} />
				<img src={right} alt="right" className={CLASS + '-character-right'} />
				<img src={spear} alt="spear" className={CLASS + '-character-weapon'} />
			</div>
		</div>
	);
}
