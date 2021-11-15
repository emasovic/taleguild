import React from 'react';
import PropTypes from 'prop-types';

import face from 'images/guildatar/head/head.svg';

import body from 'images/guildatar/body/body.svg';

import ImageContainer from 'components/widgets/image/Image';

import './Guildatar.scss';

const CLASS = 'st-Guildatar';

export default function Guildatar({head, face, body, leftArm, rightArm}) {
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
	face,
	body,
};

Guildatar.propTypes = {
	head: PropTypes.string,
	face: PropTypes.string,
	body: PropTypes.string,
	leftArm: PropTypes.string,
	rightArm: PropTypes.string,
};
