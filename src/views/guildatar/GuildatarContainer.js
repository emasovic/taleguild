import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import camelCase from 'lodash.camelcase';

import {getImageUrl} from 'lib/util';
import {MARKETPLACE} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TEXT_CURSORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {COLOR} from 'types/button';
import {PARTS} from 'types/guildatar';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import {useFormik} from 'formik';

import {createOrUpdateGuildatar, loadGuildatar, selectGuildatarById} from 'redux/guildatars';
import {loadUserItems, selectUserItems, selectItemFromUserItemById} from 'redux/userItems';

import {useGetSearchParams} from 'hooks/getSearchParams';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';
import Loader from 'components/widgets/loader/Loader';
import ShowMore from 'components/widgets/show-more/ShowMore';
import HorizontalList from 'components/widgets/lists/horizontal-list/HorizontalList';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';

import MarketplaceItem from 'components/marketplace/MarketplaceItem';

import Guildatar from 'components/guildatar/Guildatar';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';

import './GuildatarContainer.scss';

const CLASS = 'st-GuildatarContainer';

const BODY_PARTS = PARTS.map(item => ({id: item.value, name: item.label}));

export default function GuildatarContainer() {
	const {id} = useParams();
	const dispatch = useDispatch();
	const guildatar = useSelector(state => selectGuildatarById(state, id));
	const {op, pages, currentPage} = useSelector(state => state.userItems);
	const items = useSelector(selectUserItems);

	const [isOpen, setIsOpen] = useState(false);

	const {body_part: bodyPart} = useGetSearchParams();
	const {head, face, body, left_arm, right_arm, user, gender} = guildatar || {};

	const toggleOpen = () => setIsOpen(prevState => !prevState);

	const handleLoadUserItems = useCallback(
		(count, op, _start) => {
			dispatch(
				loadUserItems(
					{
						user: user?.id,
						'item.body_part': bodyPart || undefined,
						'item.genders': gender?.id,
						guildatar_null: true,
						...DEFAULT_LIMIT,
						_start,
						_sort: 'created_at:DESC',
					},
					count,
					op
				)
			);
		},
		[dispatch, bodyPart, user, gender]
	);

	const handleSubmit = values => {
		const payload = {
			id: values.id,
			head: values?.head?.id,
			face: values?.face?.id,
			body: values?.body?.id,
			left_arm: values?.leftArm?.id,
			right_arm: values?.rightArm?.id,
		};

		dispatch(createOrUpdateGuildatar(payload));
	};

	useEffect(() => {
		id && dispatch(loadGuildatar(id));
	}, [id, dispatch]);

	useEffect(() => {
		user?.id && handleLoadUserItems(true, undefined, 0);
	}, [dispatch, user, handleLoadUserItems]);

	const {values, dirty, handleSubmit: formikSubmit, handleReset, setFieldValue} = useFormik({
		initialValues: {
			id: Number(id),
			head,
			face,
			body,
			leftArm: left_arm,
			rightArm: right_arm,
		},
		enableReinitialize: true,
		onSubmit: handleSubmit,
	});

	if (!guildatar) {
		return (
			<div className={CLASS}>
				<Loader />
			</div>
		);
	}

	const {
		head: avatarHead,
		face: avatarFace,
		body: avatarBody,
		leftArm: avatarLeftArm,
		rightArm: avatarRightArm,
	} = values;

	let defaultItems = [head, face, body, left_arm, right_arm].filter(Boolean);
	defaultItems = bodyPart
		? defaultItems.filter(i => i?.item?.body_part === bodyPart)
		: defaultItems;

	const total = defaultItems.length + items.length;
	return (
		<MobileWrapper className={CLASS}>
			<form onSubmit={formikSubmit}>
				<div className={CLASS + '-header'}>
					<div className={CLASS + '-header-left-box'}>
						<div className={CLASS + '-header-left-box-title'}>
							<Typography
								fontWeight={FONT_WEIGHT.bold}
								component={TYPOGRAPHY_VARIANTS.h4}
								variant={TYPOGRAPHY_VARIANTS.h4}
								font={FONTS.merri}
							>
								{guildatar.name}
							</Typography>
						</div>
						<div className={CLASS + '-header-left-box-edit'}>
							<IconButton color={COLOR.secondary} onClick={toggleOpen}>
								Edit
							</IconButton>
						</div>
					</div>

					<div className={CLASS + '-header-actions'}>
						<IconButton color={COLOR.secondary} disabled={!dirty} onClick={handleReset}>
							Cancel
						</IconButton>
						<IconButton disabled={!dirty}>Save</IconButton>
					</div>
				</div>
				<div className={CLASS + '-content'}>
					<div className={CLASS + '-content-avatar'}>
						<Typography
							color={TEXT_COLORS.tertiary}
							fontWeight={FONT_WEIGHT.semiBold}
							component={TYPOGRAPHY_VARIANTS.p}
						>
							Guildatar
						</Typography>
						<div className={CLASS + '-content-avatar-guildatar'}>
							<Guildatar
								head={getImageUrl(avatarHead?.item?.image?.url)}
								face={getImageUrl(avatarFace?.item?.image?.url)}
								body={getImageUrl(avatarBody?.item?.image?.url)}
								leftArm={getImageUrl(avatarLeftArm?.item?.image?.url)}
								rightArm={getImageUrl(avatarRightArm?.item?.image?.url)}
								gender={guildatar?.gender?.gender}
							/>
						</div>

						<div className={CLASS + '-content-avatar-description'}>
							<Typography
								color={TEXT_COLORS.tertiary}
								fontWeight={FONT_WEIGHT.semiBold}
								component={TYPOGRAPHY_VARIANTS.p}
							>
								Description
							</Typography>
							<ShowMore
								className={CLASS + '-content-avatar-description-text'}
								textProps={{
									color: TEXT_COLORS.secondary,
								}}
								actionComponent={Typography}
								actionProps={{
									color: TEXT_COLORS.buttonPrimary,
									cursor: TEXT_CURSORS.pointer,
									className: CLASS + '-content-avatar-description-text-action',
								}}
								text={guildatar.description}
							/>
						</div>
					</div>
					<div className={CLASS + '-content-items'}>
						<HorizontalList
							items={BODY_PARTS}
							loading={false}
							title="Items"
							urlParamName="body_part"
							childrenLoading={op === DEFAULT_OP.loading}
						/>

						{op !== DEFAULT_OP.loading ? (
							!total ? (
								<>
									<PagePlaceholder
										title="Buy items on Market"
										subtitle="You currently have none of the items for this category"
										buttonLabel="Visit market"
										to={{
											pathname: MARKETPLACE,
											search: bodyPart && `?body_part=${bodyPart}`,
										}}
									/>
								</>
							) : (
								<LoadMore
									id="user-items"
									onLoadMore={() =>
										handleLoadUserItems(
											false,
											DEFAULT_OP.load_more,
											currentPage * DEFAULT_LIMIT._limit
										)
									}
									shouldLoad={pages > currentPage}
									loading={op === DEFAULT_OP.load_more}
									className={CLASS + '-content-items-load_more'}
								>
									{defaultItems.map(i => (
										<MarketplaceItem
											key={i.id}
											id={i.id}
											active={
												values[camelCase(i.item.body_part)]?.id === i.id
											}
											selector={selectItemFromUserItemById}
											item={i.item}
											displayPrice={false}
											onClick={() => setFieldValue(i?.item?.body_part, i)}
										/>
									))}
									{items.map(i => (
										<MarketplaceItem
											key={i.id}
											selector={selectItemFromUserItemById}
											active={
												values[camelCase(i.item.body_part)]?.id === i.id
											}
											id={i.id}
											displayPrice={false}
											onClick={() => setFieldValue(i?.item?.body_part, i)}
										/>
									))}
								</LoadMore>
							)
						) : (
							<Loader className={CLASS + '-content-items-loader'} />
						)}
					</div>
				</div>
			</form>
			{isOpen && <GuildatarDialog isOpen={isOpen} onClose={toggleOpen} id={guildatar.id} />}
		</MobileWrapper>
	);
}
