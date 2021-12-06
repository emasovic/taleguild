import React from 'react';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';

import {goToWidget} from 'lib/routes';

import {DEFAULT_CRITERIA} from 'types/story';
import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import FA from 'types/font_awesome';

import SideBar from 'views/stories/SideBar';

import Stories from 'views/stories/Stories';
import StoryTabs from 'views/stories/StoryTabs';
import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import './Community.scss';

const CLASS = 'st-Community';

export const WIDGETS = {
	explore: 'explore',
	following: 'following',
};

export default function Community() {
	const {widget} = useParams();
	const criteria = {
		...DEFAULT_CRITERIA,
		relevant: widget === WIDGETS.following ? true : undefined,
	};
	return (
		<div className={CLASS}>
			<div className={CLASS + '-header'}>
				<div className={CLASS + '-header-title'}>
					<Typography
						variant={TYPOGRAPHY_VARIANTS.h4}
						component={TYPOGRAPHY_VARIANTS.h4}
						font={FONTS.merri}
					>
						Place where you can gain knowledge
					</Typography>
					<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
						Here you can find amazing stories from other writers and get feedback
					</Typography>
				</div>

				<div className={CLASS + '-header-actions'}>
					<IconButton
						tag={Link}
						to={goToWidget(WIDGETS.following)}
						active={widget === WIDGETS.following}
						icon={FA.solid_users}
						outline
						tertiary
					>
						Following
					</IconButton>
					<IconButton
						tag={Link}
						to={goToWidget(WIDGETS.explore)}
						active={widget === WIDGETS.explore}
						icon={FA.compass}
						outline
						tertiary
					>
						Explore
					</IconButton>
				</div>
			</div>
			<div className={CLASS + '-main'}>
				<div className={CLASS + '-main-holder'}>
					<SideBar />
				</div>

				<Stories criteria={criteria} />
				<div className={CLASS + '-main-holder'}>
					<StoryTabs />
				</div>
			</div>
		</div>
	);
}
