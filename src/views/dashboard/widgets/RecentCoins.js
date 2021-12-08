import React from 'react';
import {useSelector} from 'react-redux';

import {getUserPointsAndCoins} from 'lib/api';
import {setTimeToDate} from 'lib/util';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {ICONS} from 'types/icons';

import {selectAuthUser} from 'redux/auth';

import {useLoadItems} from 'hooks/getItems';

import Typography from 'components/widgets/typography/Typography';
import Icon from 'components/widgets/icon/Icon';

import RecentStats from './RecentStats';

export default function RecentCoins() {
	const {data} = useSelector(selectAuthUser);
	const {stats} = useSelector(state => state.auth);
	let [{data: result, error, isLoading}] = useLoadItems(getUserPointsAndCoins, {
		user: data?.id,
		created_at_gte: setTimeToDate(0, 0, 0),
		created_at_lte: setTimeToDate(23, 59, 59),
	});

	result = result?.reduce((acc, val) => acc + val.coins, 0);

	const topStats = (
		<>
			<Typography variant={TYPOGRAPHY_VARIANTS.h3} font={FONTS.merri}>
				{stats?.coins}
			</Typography>
			<Icon icon={ICONS.coin} />
		</>
	);

	const bottomStats = (
		<Typography>
			{result}
			<Typography color={TEXT_COLORS.secondary}> coins earned today</Typography>
		</Typography>
	);

	return (
		<RecentStats
			topStats={topStats}
			bottomStats={bottomStats}
			isLoading={isLoading}
			error={error}
		/>
	);
}
