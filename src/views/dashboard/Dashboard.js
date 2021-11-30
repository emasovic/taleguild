import React from 'react';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {selectAuthUser} from 'redux/auth';

import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import Typography from 'components/widgets/typography/Typography';

import RecentItems from './widgets/RecentItems';
import RecentWork from './widgets/RecentWork';
import RecentViews from './widgets/RecentViews';

import './Dashboard.scss';

const CLASS = 'st-Dashboard';

export default function Dashboard() {
	const {data} = useSelector(selectAuthUser);

	const displayName = data?.display_name || data?.username;
	return (
		<MobileWrapper className={CLASS}>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.h4}
				component={TYPOGRAPHY_VARIANTS.h4}
				font={FONTS.merri}
			>
				Welcome back, {displayName}
			</Typography>
			<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
				It’s {format(new Date(), 'EEEE')}, great day to start working on you next story.
			</Typography>
			<div className={CLASS + '-content'}></div>
			<div className={CLASS + '-content'}>
				<RecentItems />
				<RecentWork />
				<RecentViews />
			</div>
		</MobileWrapper>
	);
}
