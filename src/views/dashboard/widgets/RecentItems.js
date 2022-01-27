import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {FONT_WEIGHT, TEXT_COLORS, TEXT_TRASFORM} from 'types/typography';
import {DEFAULT_OP} from 'types/default';
import {ICONS} from 'types/icons';
import {COLOR} from 'types/button';

import {loadMarketplace, selectMarketplaceById, selectMarketplaceIds} from 'redux/marketplace';
import {countAllGuildatars} from 'redux/guildatars';
import {selectAuthUser} from 'redux/auth';

import MarketplaceDialog from 'components/marketplace/MarketplaceDialog';
import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';
import Icon from 'components/widgets/icon/Icon';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import NoItemsPlaceholder from './NoItemsPlaceholder';

import './RecentItems.scss';

const CLASS = 'st-RecentItems';

const RecentItem = ({id, onClick}) => {
	const {preview, price, name, category} = useSelector(state => selectMarketplaceById(state, id));
	return (
		<div className={CLASS + '-item'} onClick={() => onClick(id)}>
			<ImageContainer image={preview} width={100} height={100} />
			<div className={CLASS + '-item-data'}>
				<Typography
					color={TEXT_COLORS.tertiary}
					textTransform={TEXT_TRASFORM.uppercase}
					fontWeight={FONT_WEIGHT.semiBold}
				>
					{category?.display_name}
				</Typography>
				<Typography>{name}</Typography>

				<Typography color={TEXT_COLORS.secondary} className={CLASS + '-item-data-price'}>
					<Icon icon={ICONS.coin} size={20} /> &nbsp;&nbsp;{price} coins
				</Typography>
			</div>
		</div>
	);
};

RecentItem.propTypes = {
	id: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default function RecentItems() {
	const dispatch = useDispatch();

	const [selectedItem, setSelectedItem] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const marketplace = useSelector(selectMarketplaceIds);
	const {data} = useSelector(selectAuthUser);
	const {op} = useSelector(state => state.marketplace);
	const {total, op: guildatarOp} = useSelector(state => state.guildatars);

	const userId = data?.id;

	useEffect(() => userId && dispatch(countAllGuildatars({user: userId})), [userId, dispatch]);

	useEffect(
		() =>
			total &&
			dispatch(
				loadMarketplace(
					{
						_start: 0,
						_limit: 4,
						_sort: 'created_at:DESC',
					},
					true
				)
			),
		[dispatch, total]
	);

	return (
		<div className={CLASS}>
			<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
				New items
			</Typography>
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
				{!!total &&
					marketplace.map(i => <RecentItem key={i} id={i} onClick={setSelectedItem} />)}
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
