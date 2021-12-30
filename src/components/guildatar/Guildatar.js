import React from 'react';
import PropTypes from 'prop-types';

import {GENDERS} from 'types/guildatar';

import femaleHead from 'images/guildatar/female-hair.svg';

import femaleFace from 'images/guildatar/female-face.svg';
import maleFace from 'images/guildatar/male-face.svg';

import femaleBody from 'images/guildatar/female-body.svg';
import maleBody from 'images/guildatar/male-body.svg';

import ImageContainer from 'components/widgets/image/Image';

import './Guildatar.scss';

const CLASS = 'st-Guildatar';

const DEFAULT_GUILDATARS = {
	[GENDERS.male]: {
		face: maleFace,
		body: maleBody,
	},
	[GENDERS.female]: {
		head: femaleHead,
		face: femaleFace,
		body: femaleBody,
	},
};

export default function Guildatar({head, face, body, leftArm, rightArm, gender}) {
	const defaultGuildatar = DEFAULT_GUILDATARS[gender];
	head = head || defaultGuildatar.head;
	face = face || defaultGuildatar.face;
	body = body || defaultGuildatar.body;
	return (
		<div className={CLASS}>
			<div className={CLASS + '-character'}>
				{head && (
					<ImageContainer
						src={head}
						alt="helmet"
						imageClassName={CLASS + '-character-helmet'}
						thumbClassName={CLASS + '-character-helmet'}
					/>
				)}
				<ImageContainer
					src={face}
					alt="head"
					imageClassName={CLASS + '-character-head'}
					thumbClassName={CLASS + '-character-head'}
				/>
				<ImageContainer
					src={body}
					alt="body"
					imageClassName={CLASS + '-character-body'}
					thumbClassName={CLASS + '-character-body'}
				/>
				{leftArm && (
					<ImageContainer
						src={leftArm}
						alt="left_weapon"
						imageClassName={CLASS + '-character-left_weapon'}
						thumbClassName={CLASS + '-character-left_weapon'}
					/>
				)}
				{rightArm && (
					<ImageContainer
						src={rightArm}
						alt="right_weapon"
						imageClassName={CLASS + '-character-right_weapon'}
						thumbClassName={CLASS + '-character-right_weapon'}
					/>
				)}
			</div>
		</div>
	);
}

Guildatar.defaultProps = {
	gender: GENDERS.male,
};

Guildatar.propTypes = {
	head: PropTypes.string,
	face: PropTypes.string,
	body: PropTypes.string,
	leftArm: PropTypes.string,
	rightArm: PropTypes.string,
	gender: PropTypes.string,
};
