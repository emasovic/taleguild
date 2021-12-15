import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router';

import {getGenders} from 'lib/api';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {GENDERS, PARTS} from 'types/guildatar';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import {CATEGORY_TYPES} from 'types/category';

import {loadMarketplace, selectMarketplaceIds} from 'redux/marketplace';
import {countAllGuildatars} from 'redux/guildatars';
import {selectAuthUser} from 'redux/auth';
import {loadCategories, selectCategories} from 'redux/categories';
import {navigateToQuery} from 'redux/application';

import {useLoadItems} from 'hooks/getItems';

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
import Switch from 'components/widgets/switch/Switch';

import {ReactComponent as NoSearchResults} from 'images/no-search-results.svg';

import './Marketplace.scss';

const CLASS = 'st-Marketplace';

const BODY_PARTS = PARTS.map(item => ({id: item.value, name: item.label}));

export default function Marketplace() {
	const dispatch = useDispatch();

	const items = useSelector(selectMarketplaceIds);
	const {data} = useSelector(selectAuthUser);
	const {op, currentPage, pages} = useSelector(state => state.marketplace);
	const {total} = useSelector(state => state.guildatars);
	const marketCategories = useSelector(selectCategories);
	const {loading} = useSelector(state => state.categories);
	const [{data: genders}] = useLoadItems(getGenders);

	const [selectedItem, setSelectedItem] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const body_part = new URLSearchParams(useLocation().search).get('body_part');
	const category = new URLSearchParams(useLocation().search).get('category');
	const name = new URLSearchParams(useLocation().search).get('name');
	const gender = new URLSearchParams(useLocation().search).get('gender');

	const selectedGender = genders.find(g => g.id === Number(gender));

	const categories = marketCategories
		.filter(i => (body_part ? i.body_part === body_part : i))
		.map(i => ({
			id: i.id,
			name: i.display_name,
		}));
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
					onLoadMore={() =>
						handleLoadMarketplace(false, currentPage * 10, DEFAULT_OP.load_more)
					}
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

	const handleSwitch = val => {
		const gender = genders.find(g =>
			val ? g.gender === GENDERS.male : g.gender === GENDERS.female
		);

		dispatch(
			navigateToQuery({
				gender: gender.id,
			})
		);
	};

	const handleLoadMarketplace = useCallback(
		(count, op, _start) => {
			dispatch(
				loadMarketplace(
					{
						body_part,
						category,
						name_contains: name,
						genders: gender,
						...DEFAULT_LIMIT,
						_start,
					},
					count,
					op
				)
			);
		},
		[dispatch, category, name, gender, body_part]
	);

	useEffect(() => {
		dispatch(loadCategories({type: CATEGORY_TYPES.market}));
	}, [dispatch]);

	useEffect(() => {
		data && dispatch(countAllGuildatars({user: data.id}));
	}, [dispatch, data]);

	useEffect(() => {
		handleLoadMarketplace(true, null, 0);
	}, [dispatch, handleLoadMarketplace]);

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
					resetParamsOnChange
				/>

				<div className={CLASS + '-nav-actions'}>
					<Switch
						labelChecked="Female"
						labelUnchecked="Male"
						checked={selectedGender?.gender === GENDERS.female ? false : true}
						onChange={handleSwitch}
					/>
					<SearchInput
						placeholder="Search item"
						defaultValue={name}
						urlParamName="name"
					/>
				</div>
			</div>

			<div className={CLASS + '-market'}>
				<div className={CLASS + '-market-categories'}>
					<SideNav
						items={categories}
						loading={!!loading}
						title="Categories"
						urlParamName="category"
					/>
				</div>
				<div className={CLASS + '-market-items'}>
					{!total ? (
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
