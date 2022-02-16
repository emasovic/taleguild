import React from 'react';
import {useSelector} from 'react-redux';
import {format} from 'date-fns';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {COLOR} from 'types/button';

import {selectAuthUser} from 'redux/auth';

import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import Typography from 'components/widgets/typography/Typography';
import CopyToClipboard from 'components/widgets/copy-to-clipboard/CopyToClipboard';

import RecentItems from './widgets/RecentItems';
import RecentWork from './widgets/RecentWork';
import RecentViews from './widgets/RecentViews';
import RecentCoins from './widgets/RecentCoins';
import RecentFocus from './widgets/RecentFocus';
import RecentXp from './widgets/RecentXp';

import './Dashboard.scss';

const CLASS = 'st-Dashboard';

export default function Dashboard() {
	const {data} = useSelector(selectAuthUser);

	const displayName = data?.display_name || data?.username;
	const url = `${location.origin}/register?referral=${data?.username}`;
	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-header'}>
				<div className={CLASS + '-header-welcome'}>
					<Typography
						variant={TYPOGRAPHY_VARIANTS.h4}
						component={TYPOGRAPHY_VARIANTS.h4}
						fontWeight={FONT_WEIGHT.bold}
						font={FONTS.merri}
					>
						Welcome {displayName}!
					</Typography>
					<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
						It’s {format(new Date(), 'EEEE')}, a great day to start working on the next
						story.
					</Typography>
				</div>
				<CopyToClipboard
					url={url}
					title="Share your referral link with friends and get coins"
					className={CLASS + '-header-copy'}
					buttonProps={{color: COLOR.secondary}}
				/>
			</div>

			<div className={CLASS + '-content'}>
				<RecentCoins />
				<RecentFocus />
				<RecentXp />
			</div>
			<div className={CLASS + '-content'}>
				<RecentItems />
				<RecentWork />
				<RecentViews />
			</div>
		</MobileWrapper>
	);
}
