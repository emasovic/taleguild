import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {FONT_WEIGHT, TEXT_COLORS, TEXT_TRASFORM} from 'types/typography';
import {ICONS} from 'types/icons';
import {COLOR} from 'types/button';

import {loadMarketplace, selectMarketplaceById, selectMarketplaceIds} from 'redux/marketplace';

import MarketplaceDialog from 'components/marketplace/MarketplaceDialog';
import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';
import Icon from 'components/widgets/icon/Icon';
import Loader from 'components/widgets/loader/Loader';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';

import NoItemsPlaceholder from './NoItemsPlaceholder';

import './RecentItems.scss';

const CLASS = 'st-RecentItems';

const RecentItem = ({id, onClick}) => {
	const {image, price, name, category} = useSelector(state => selectMarketplaceById(state, id));
	return (
		<div className={CLASS + '-item'} onClick={() => onClick(id)}>
			<ImageContainer image={image} width={100} height={100} />
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
	const {op} = useSelector(state => state.marketplace);

	useEffect(() => {
		dispatch(
			loadMarketplace(
				{
					_start: 0,
					_limit: 4,
					_sort: 'created_at:DESC',
				},
				true
			)
		);
	}, [dispatch]);

	if (!marketplace.length && !op) {
		return (
			<>
				<NoItemsPlaceholder
					title="Build your characters"
					subtitle="With your writing you can collect coins and create characters from Market"
					buttonText="Create guildatar"
					buttonProps={{onClick: () => setIsOpen(true), color: COLOR.secondary}}
				/>
				{isOpen && <GuildatarDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />}
			</>
		);
	}
	return (
		<div className={CLASS}>
			<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
				New items
			</Typography>
			{!op ? (
				marketplace.map(i => <RecentItem key={i} id={i} onClick={setSelectedItem} />)
			) : (
				<Loader />
			)}
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
