import React from 'react';
import PropTypes from 'prop-types';

import {LOGIN, REGISTER} from 'lib/routes';

import {COLOR} from 'types/button';
import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_TRASFORM,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';

import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import ImageContainer from 'components/widgets/image/Image';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import {ReactComponent as RecentWork} from 'images/recent-work.svg';
import {ReactComponent as Items} from 'images/items.svg';
import feedback from 'images/feedback.png';
import landing from 'images/landing-video.mp4';

import './LandingPage.scss';

const CLASS = 'st-LandingPage';

const LandingItem = ({header, title, subtitle, link}) => (
	<div className={CLASS + '-item'}>
		<Typography
			textTransform={TEXT_TRASFORM.uppercase}
			fontWeight={FONT_WEIGHT.bold}
			color={TEXT_COLORS.tertiary}
			className={CLASS + '-item-header'}
		>
			{header}
		</Typography>
		<Typography
			component={TYPOGRAPHY_VARIANTS.h3}
			variant={TYPOGRAPHY_VARIANTS.h3}
			fontWeight={FONT_WEIGHT.bold}
			className={CLASS + '-item-title'}
			font={FONTS.merri}
		>
			{title}
		</Typography>
		<Typography color={TEXT_COLORS.secondary} className={CLASS + '-item-subtitle'}>
			{subtitle}
		</Typography>
		<Link to={REGISTER} underline={UNDERLINE.hover} className={CLASS + '-item-link'}>
			{link}
		</Link>
	</div>
);

LandingItem.propTypes = {
	header: PropTypes.string,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	link: PropTypes.string,
};

export default function LandingPage() {
	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-header'}>
				<Typography
					textTransform={TEXT_TRASFORM.uppercase}
					fontWeight={FONT_WEIGHT.semiBold}
					color={TEXT_COLORS.buttonPrimary}
					className={CLASS + '-header-title'}
				>
					Gamified writing
				</Typography>
				<Typography
					component={TYPOGRAPHY_VARIANTS.h1}
					variant={TYPOGRAPHY_VARIANTS.h1}
					fontWeight={FONT_WEIGHT.bold}
					font={FONTS.merri}
					className={CLASS + '-header-heading'}
				>
					Become master of your craft
				</Typography>
				<Typography
					color={TEXT_COLORS.secondary}
					component={TYPOGRAPHY_VARIANTS.h2}
					variant={TYPOGRAPHY_VARIANTS.h2}
				>
					Taleguild is a writing tool that helps you create stories through gamified
					experience.
				</Typography>
				<div className={CLASS + '-header-actions'}>
					<IconButton tag={Link} to={REGISTER}>
						Join us now
					</IconButton>
					<IconButton tag={Link} to={LOGIN} color={COLOR.secondary}>
						Sign in
					</IconButton>
				</div>
			</div>
			<video src={landing} className={CLASS + '-video'} loop autoPlay muted />
			<div className={CLASS + '-focus'}>
				<div className={CLASS + '-focus-text'}>
					<LandingItem
						header="Improve productivity"
						title="Focus on what is matter"
						subtitle="An ideal setting for focusing solely on your words, thanks to its minimalist
						design and its having only the basic functions required for your writing."
						link="Start writing"
					/>
				</div>
				<div className={CLASS + '-focus-recent'}>
					<div className={CLASS + '-focus-recent-content'}>
						<Typography fontWeight={FONT_WEIGHT.bold} color={TEXT_COLORS.tertiary}>
							Recent work
						</Typography>
						<RecentWork width="auto" height="auto" />
						<RecentWork width="auto" height="auto" />
					</div>
				</div>
			</div>
			<div className={CLASS + '-build'}>
				<div className={CLASS + '-build-habit'}>
					<LandingItem
						header="Build habits"
						title="Earn rewards for your writing"
						subtitle="Get coins with distractions-free writing and unlock items such as swords, spears, helmets and magical clothes for your story characters."
						link="Build your habits"
					/>
					<Items width="auto" />
				</div>
				<div className={CLASS + '-build-community'}>
					<ImageContainer
						src={feedback}
						thumbClassName={CLASS + '-build-community-image'}
						imageClassName={CLASS + '-build-community-image'}
					/>
					<LandingItem
						header="Get feedback"
						title="Community to inspire you"
						subtitle="Our guild is here to help you shape your art and craft. Share your work with other writers on our app and get feedback from them about your work."
						link="Join our community"
					/>
				</div>
			</div>
		</MobileWrapper>
	);
}
