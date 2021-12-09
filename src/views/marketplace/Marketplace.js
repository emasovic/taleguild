import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {ITEM_CATEGORIES, PARTS} from 'types/guildatar';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';

import {loadMarketplace, selectMarketplaceIds} from 'redux/marketplace';
import {loadGuildatars, selectActiveGuildatar} from 'redux/guildatars';
import {selectAuthUser} from 'redux/auth';

import MarketplaceItem from 'components/marketplace/MarketplaceItem';
import MarketplaceDialog from 'components/marketplace/MarketplaceDialog';

import Typography from 'components/widgets/typography/Typography';
import SideNav from 'views/stories/widgets/side-nav/SideNav';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import Loader from 'components/widgets/loader/Loader';
import HorizontalList from 'components/widgets/horizontal-list/HorizontalList';
import SearchInput from 'components/search-input/SearchInput';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';

import {ReactComponent as NoSearchResults} from 'images/no-search-results.svg';

import './Marketplace.scss';

const CLASS = 'st-Marketplace';

const BODY_PARTS = PARTS.map(item => ({id: item.value, name: item.label}));

export default function Marketplace() {
	const dispatch = useDispatch();

	const items = useSelector(selectMarketplaceIds);
	const {data} = useSelector(selectAuthUser);
	const {op, currentPage, pages} = useSelector(state => state.marketplace);
	const guildatar = useSelector(selectActiveGuildatar);

	const [selectedItem, setSelectedItem] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const body_part = new URLSearchParams(useLocation().search).get('body_part');
	const category = new URLSearchParams(useLocation().search).get('category');
	const name = new URLSearchParams(useLocation().search).get('name');

	const categories = ITEM_CATEGORIES.filter(i => (body_part ? i.category === body_part : i)).map(
		i => ({
			id: i.value,
			name: i.label,
		})
	);
	const shouldLoad = pages > currentPage && !op;

	const renderMarketPlaceItems = () => {
		return op === DEFAULT_OP.loading ? (
			<Loader />
		) : items.length ? (
			<>
				<Typography
					variant={TYPOGRAPHY_VARIANTS.action1}
					color={TEXT_COLORS.secondary}
					fontWeight={FONT_WEIGHT.bold}
					className={CLASS + '-market-items-title'}
				>
					Items
				</Typography>
				<LoadMore
					className={CLASS + '-market-items-loadmore'}
					id="marketplace"
					onLoadMore={handleCount}
					shouldLoad={shouldLoad}
					loading={op === DEFAULT_LIMIT.load_more}
				>
					{items.map(i => (
						<MarketplaceItem key={i} id={i} onClick={setSelectedItem} />
					))}
				</LoadMore>
			</>
		) : (
			<PagePlaceholder
				IconComponent={NoSearchResults}
				title="No results found"
				subtitle="We couldn’t find what you are looking for"
			/>
		);
	};

	const handleCount = useCallback(() => {
		const loadMoreCriteria = {
			body_part,
			category,
			name_contains: name,
			_start: currentPage * 10,
		};
		dispatch(loadMarketplace(loadMoreCriteria, false, DEFAULT_OP.load_more));
	}, [dispatch, currentPage, category, name, body_part]);

	useEffect(() => {
		data && dispatch(loadGuildatars({user: data.id, active: true}));
	}, [dispatch, data]);

	useEffect(() => {
		guildatar &&
			dispatch(
				loadMarketplace(
					{
						body_part,
						category,
						name_contains: name,
						gender: guildatar.gender,
						...DEFAULT_LIMIT,
					},
					true
				)
			);
	}, [dispatch, category, body_part, name, guildatar]);

	return (
		<MobileWrapper className={CLASS}>
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

			<div className={CLASS + '-nav'}>
				<HorizontalList
					items={BODY_PARTS}
					loading={false}
					urlParamName="body_part"
					childrenLoading={op === DEFAULT_OP.loading}
					resetParamsOnChange
				/>

				<SearchInput placeholder="Search item" defaultValue={name} urlParamName="name" />
			</div>

			<div className={CLASS + '-market'}>
				<div className={CLASS + '-market-categories'}>
					<SideNav
						items={categories}
						loading={false}
						title="Categories"
						urlParamName="category"
					/>
				</div>
				<div className={CLASS + '-market-items'}>
					{!guildatar ? (
						<PagePlaceholder
							title="Create your first Guildatar"
							subtitle="In order to access the Market, you first need to create your guildarter for whom you will buy items with coins"
							buttonLabel="Create Guildatar"
							buttonProps={{
								to: undefined,
								tag: undefined,
								onClick: () => setIsOpen(true),
							}}
						/>
					) : (
						renderMarketPlaceItems()
					)}
				</div>
			</div>
			{!!selectedItem && (
				<MarketplaceDialog
					isOpen={!!selectedItem}
					itemId={selectedItem}
					onClose={() => setSelectedItem(null)}
				/>
			)}
			{!!isOpen && <GuildatarDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />}
		</MobileWrapper>
	);
}
