import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {MARKETPLACE} from 'lib/routes';

import {FONT_WEIGHT, TEXT_COLORS} from 'types/typography';
import {DEFAULT_OP} from 'types/default';

import {COLOR} from 'types/button';

import {loadMarketplace, selectMarketplaceIds} from 'redux/marketplace';
import {countAllGuildatars} from 'redux/guildatars';
import {selectAuthUser} from 'redux/auth';

import MarketplaceDialog from 'components/marketplace/MarketplaceDialog';
import Typography from 'components/widgets/typography/Typography';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import MarketplaceItem from 'components/marketplace/MarketplaceItem';

import NoItemsPlaceholder from './NoItemsPlaceholder';

import './RecentItems.scss';

const CLASS = 'st-RecentItems';

export default function RecentItems() {
	const dispatch = useDispatch();

	const [selectedItem, setSelectedItem] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const marketplace = useSelector(selectMarketplaceIds);
	const {data, stats} = useSelector(selectAuthUser);
	const {op} = useSelector(state => state.marketplace);
	const {total, op: guildatarOp} = useSelector(state => state.guildatars);

	const userId = data?.id;

	useEffect(() => userId && dispatch(countAllGuildatars({filters: {user: userId}})), [
		userId,
		dispatch,
	]);

	useEffect(
		() =>
			total &&
			dispatch(
				loadMarketplace(
					{
						pagination: {
							start: 0,
							limit: 4,
						},
						sort: ['createdAt:DESC'],
					},
					true
				)
			),
		[dispatch, total]
	);

	return (
		<div className={CLASS}>
			{!!total && (
				<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
					New items
				</Typography>
			)}
			<LoadMore
				id="recentItems"
				total={total}
				loading={op[DEFAULT_OP.loading].loading || !guildatarOp[DEFAULT_OP.loading].success}
				showItems={
					!op[DEFAULT_OP.loading].loading && guildatarOp[DEFAULT_OP.loading].success
				}
				NoItemsComponent={NoItemsPlaceholder}
				noItemsComponentProps={{
					title: 'Build your Guildatars',
					subtitle:
						'Collect coins to buy items such as armors, swords, shields and more, and upgrade your Guildatar',
					buttonText: 'Create guildatar',
					buttonProps: {onClick: () => setIsOpen(true), color: COLOR.secondary},
				}}
				shouldLoad={false}
			>
				{!!total && (
					<>
						{marketplace.map(i => (
							<MarketplaceItem
								key={i}
								id={i}
								singleView
								userStats={stats}
								onClick={setSelectedItem}
								className={CLASS + '-item'}
							/>
						))}
						<Link
							to={MARKETPLACE}
							underline={UNDERLINE.hover}
							className={CLASS + '-link'}
						>
							View all
						</Link>
					</>
				)}
			</LoadMore>
			{isOpen && <GuildatarDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />}
			{selectedItem && (
				<MarketplaceDialog
					isOpen={!!selectedItem}
					itemId={selectedItem}
					onClose={() => setSelectedItem(null)}
				/>
			)}
		</div>
	);
}
