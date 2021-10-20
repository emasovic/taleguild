import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {PARTS} from 'types/guildatar';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {loadMarketplace, selectMarketplaceIds} from 'redux/marketplace';

import MarketplaceItem from 'components/marketplace/MarketplaceItem';
import MarketplaceDialog from 'components/marketplace/MarketplaceDialog';

import Typography from 'components/widgets/typography/Typography';
import SideNav from 'views/stories/widgets/side-nav/SideNav';
import LoadMore from 'components/widgets/loadmore/LoadMoreModal';
import Loader from 'components/widgets/loader/Loader';

import './Marketplace.scss';

const CLASS = 'st-Marketplace';

const BODY_PARTS = PARTS.map(item => ({id: item.value, name: item.label}));

export default function Marketplace() {
	const dispatch = useDispatch();

	const items = useSelector(selectMarketplaceIds);
	const {op, currentPage, pages} = useSelector(state => state.marketplace);

	const [selectedItem, setSelectedItem] = useState(null);

	const body_part = new URLSearchParams(useLocation().search).get('body_part');
	const shouldLoad = pages > currentPage && !op;

	const renderMarketPlaceItems = () => {
		return op === DEFAULT_OP.loading ? (
			<Loader />
		) : (
			<LoadMore
				id="marketplace"
				onLoadMore={handleCount}
				shouldLoad={shouldLoad}
				loading={op === DEFAULT_LIMIT.load_more}
			>
				{items.map(i => (
					<MarketplaceItem key={i} id={i} onClick={setSelectedItem} />
				))}
			</LoadMore>
		);
	};

	const handleCount = useCallback(() => {
		const loadMoreCriteria = {body_part, _start: currentPage * 10};
		dispatch(loadMarketplace(loadMoreCriteria, false, DEFAULT_OP.load_more));
	}, [dispatch, currentPage, body_part]);

	useEffect(() => {
		dispatch(loadMarketplace({body_part, ...DEFAULT_LIMIT}, true));
	}, [dispatch, body_part]);

	return (
		<div className={CLASS}>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.h4}
				component={TYPOGRAPHY_VARIANTS.h4}
				font={FONTS.merri}
			>
				Welcome to Market
			</Typography>
			<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
				Here you can find amazing items for your Guildatar
			</Typography>

			<div className={CLASS + '-market'}>
				<div className={CLASS + '-market-categories'}>
					<SideNav
						items={BODY_PARTS}
						loading={false}
						title="Categories"
						urlParamName="body_part"
					/>
				</div>
				<div className={CLASS + '-market-items'}>
					<Typography
						variant={TYPOGRAPHY_VARIANTS.action1}
						color={TEXT_COLORS.secondary}
						fontWeight={FONT_WEIGHT.bold}
					>
						Items
					</Typography>
					{renderMarketPlaceItems()}
				</div>
			</div>
			{!!selectedItem && (
				<MarketplaceDialog
					isOpen={!!selectedItem}
					itemId={selectedItem}
					onClose={() => setSelectedItem(null)}
				/>
			)}
		</div>
	);
}
