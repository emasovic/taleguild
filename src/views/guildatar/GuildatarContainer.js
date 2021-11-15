import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router';

import {getImageUrl} from 'lib/util';

import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_CURSORS,
	TEXT_TRASFORM,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';
import {COLOR} from 'types/button';
import {PARTS} from 'types/guildatar';
import {DEFAULT_LIMIT, DEFAULT_OP} from 'types/default';
import {useFormik} from 'formik';

import {createOrUpdateGuildatar, loadGuildatar, selectGuildatarById} from 'redux/guildatars';
import {loadUserItems, selectUserItems} from 'redux/userItems';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';
import Loader from 'components/widgets/loader/Loader';
import ShowMore from 'components/widgets/show-more/ShowMore';
import HorizontalList from 'components/widgets/horizontal-list/HorizontalList';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import LoadMore from 'components/widgets/loadmore/LoadMore';

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

	const bodyPart = new URLSearchParams(useLocation().search).get('body_part');
	const {head, face, body, left_arm, right_arm} = guildatar || {};

	const toggleOpen = () => setIsOpen(prevState => !prevState);

	const handleLoadMore = useCallback(() => {
		guildatar?.user?.id &&
			dispatch(
				loadUserItems(
					{
						user: guildatar.user?.id,
						'item.body_part': bodyPart || undefined,
						_limit: 10,
						_start: currentPage * 10,
						_sort: 'created_at:DESC',
					},
					false,
					DEFAULT_OP.load_more
				)
			);
	}, [currentPage, dispatch, bodyPart, guildatar]);

	const handleSubmit = values => {
		const payload = {
			...values,
			head: values?.head?.id,
			face: values?.face?.id,
			body: values?.body?.id,
			leftArm: values?.leftArm?.id,
			rightArm: values?.rightArm?.id,
		};

		dispatch(createOrUpdateGuildatar(payload));
	};

	useEffect(() => {
		id && dispatch(loadGuildatar(id));
	}, [id, dispatch]);

	useEffect(() => {
		guildatar?.user?.id &&
			dispatch(
				loadUserItems(
					{
						user: guildatar.user?.id,
						'item.body_part': bodyPart || undefined,
						'item.gender': guildatar.gender,
						...DEFAULT_LIMIT,
					},
					true
				)
			);
	}, [dispatch, guildatar, bodyPart]);

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

	// const defaultItems = [head, face, body, left_arm, right_arm];
	const {
		head: avatarHead,
		face: avatarFace,
		body: avatarBody,
		leftArm: avatarLeftArm,
		rightArm: avatarRightArm,
	} = values;

	return (
		<MobileWrapper className={CLASS}>
			<form onSubmit={formikSubmit}>
				<div className={CLASS + '-header'}>
					<div className={CLASS + '-header-title'}>
						<Typography
							color={TEXT_COLORS.tertiary}
							textTransform={TEXT_TRASFORM.uppercase}
							fontWeight={FONT_WEIGHT.semiBold}
							component={TYPOGRAPHY_VARIANTS.p}
						>
							{guildatar.class.name}
						</Typography>
						<Typography
							fontWeight={FONT_WEIGHT.bold}
							component={TYPOGRAPHY_VARIANTS.h4}
							variant={TYPOGRAPHY_VARIANTS.h4}
							font={FONTS.merri}
						>
							{guildatar.name}
						</Typography>
					</div>
					<div className={CLASS + '-header-edit'}>
						<IconButton color={COLOR.secondary} onClick={toggleOpen}>
							Edit
						</IconButton>
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
								textProps={{
									color: TEXT_COLORS.secondary,
									className: CLASS + '-content-avatar-description-text',
								}}
								actionComponent={Typography}
								actionProps={{
									color: TEXT_COLORS.tertiary,
									cursor: TEXT_CURSORS.pointer,
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
						>
							<LoadMore
								id="user-items"
								onLoadMore={handleLoadMore}
								shouldLoad={pages > currentPage}
								loading={op === DEFAULT_OP.load_more}
								className={CLASS + '-content-items-load_more'}
							>
								{items.map(i => (
									<MarketplaceItem
										key={i.id}
										item={i?.item}
										id={i.id}
										onClick={() => setFieldValue(i?.item?.body_part, i)}
									/>
								))}
							</LoadMore>
						</HorizontalList>
					</div>
				</div>
			</form>
			{isOpen && <GuildatarDialog isOpen={isOpen} onClose={toggleOpen} id={guildatar.id} />}
		</MobileWrapper>
	);
}
