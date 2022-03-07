import React from 'react';
import PropTypes from 'prop-types';

import {PRIVACY_POLICY, REGISTER, TERMS_OF_SERVICE} from 'lib/routes';

import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_TRASFORM,
	TEXT_WRAP,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';
import {THEMES} from 'types/themes';

import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import ImageContainer from 'components/widgets/image/Image';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';

import archer from 'images/archer-focus.png';
import focusLight from 'images/focus-image-light.png';
import habitsLight from 'images/habits-image-light.png';
import landingLight from 'images/landing-image-light.png';
import socialLight from 'images/social-image-light.png';
import focusDark from 'images/focus-image-dark.png';
import habitsDark from 'images/habits-image-dark.png';
import landingDark from 'images/landing-image-dark.png';
import socialDark from 'images/social-image-dark.png';

import './LandingPage.scss';

const CLASS = 'st-LandingPage';

const THEME_ITEMS = {
	light: {
		landing: landingLight,
		focus: focusLight,
		habits: habitsLight,
		social: socialLight,
	},
	dark: {
		landing: landingDark,
		focus: focusDark,
		habits: habitsDark,
		social: socialDark,
	},
};

const LandingItem = ({header, title, subtitle, link, src}) => (
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
		{src && <img src={src} className={CLASS + '-item-image'} />}
	</div>
);

LandingItem.propTypes = {
	header: PropTypes.string,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	link: PropTypes.string,
	src: PropTypes.string,
};

export default function LandingPage() {
	const theme = THEMES[localStorage.getItem('theme')] || THEMES.light;
	const themeItems = THEME_ITEMS[theme];
	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-header'}>
				<Typography
					textTransform={TEXT_TRASFORM.uppercase}
					fontWeight={FONT_WEIGHT.semiBold}
					color={TEXT_COLORS.buttonPrimary}
					wrap={TEXT_WRAP.normal}
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
					Build your writing habits
				</Typography>
				<Typography
					color={TEXT_COLORS.secondary}
					component={TYPOGRAPHY_VARIANTS.h4}
					variant={TYPOGRAPHY_VARIANTS.h4}
					className={CLASS + '-header-subheading'}
				>
					Taleguild is a writing tool that helps you be motivated to write stories through
					a gamified experience.
				</Typography>
				<div className={CLASS + '-header-actions'}>
					<IconButton tag={Link} to={REGISTER}>
						Get started now
					</IconButton>
				</div>
			</div>
			<div className={CLASS + '-landing'}>
				<ImageContainer src={themeItems.landing} className={CLASS + '-landing-image'} />
			</div>
			<div className={CLASS + '-focus'}>
				<div className={CLASS + '-focus-text'}>
					<LandingItem
						header="Improve productivity"
						title="Stay in focus while writing"
						subtitle="Our minimalist design and productivity-based text editor allow you to stay focused solely on your words and work. Stay motivated while writing your stories and articles without distractions, and become master of your art."
						link="Start writing"
						src={archer}
					/>
				</div>
				<ImageContainer
					src={themeItems.focus}
					className={CLASS + '-focus-recent-image'}
					containerClassName={CLASS + '-focus-recent-container'}
				/>
			</div>
			<div className={CLASS + '-build'}>
				<div className={CLASS + '-build-habit'}>
					<LandingItem
						header="Build habits"
						title="Earn rewards for your writing"
						subtitle="Get coins with focused-based writing and unlock items such as swords, spears, helmets and magical clothes for your story characters."
						link="Build your habits"
						src={themeItems.habits}
					/>
				</div>
				<div className={CLASS + '-build-community'}>
					<LandingItem
						header="Get feedback"
						title="Community to inspire you"
						subtitle="Our guild is here to help you shape your art and craft. Share your work with other writers on our app and get feedback from them about your work. "
						link="Join our community"
						src={themeItems.social}
					/>
				</div>
			</div>

			<div className={CLASS + '-footer'}>
				<PagePlaceholder
					className={CLASS + '-footer-placeholder'}
					title="Join us today"
					titleProps={{className: CLASS + '-footer-heading'}}
					subtitle="Start building your productive habits with our FREE gamified writing editor and community platform."
					subtitleProps={{
						component: TYPOGRAPHY_VARIANTS.h4,
						variant: TYPOGRAPHY_VARIANTS.h4,
						color: TEXT_COLORS.secondary,
						className: CLASS + '-header-subheading',
					}}
					buttonLabel="Create free account"
					buttonProps={{className: CLASS + '-footer-action'}}
					to={REGISTER}
				/>

				<Typography
					component={TYPOGRAPHY_VARIANTS.h4}
					variant={TYPOGRAPHY_VARIANTS.h4}
					wrap={TEXT_WRAP.normal}
				>
					© {new Date().getFullYear()} Taleguild.
				</Typography>

				<Typography wrap={TEXT_WRAP.normal}>
					<Link to={TERMS_OF_SERVICE} className={CLASS + '-footer-link'}>
						Terms of Service
					</Link>
					&nbsp; · &nbsp;
					<Link to={PRIVACY_POLICY} className={CLASS + '-footer-link'}>
						Privacy Policy
					</Link>
				</Typography>
			</div>
		</MobileWrapper>
	);
}
