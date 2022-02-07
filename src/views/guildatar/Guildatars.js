import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {DEFAULT_OP} from 'types/default';

import {getImageUrl} from 'lib/util';
import {goToGuildatar} from 'lib/routes';

import {selectAuthUser} from 'redux/auth';
import {loadGuildatars, selectGuildatars} from 'redux/guildatars';

import Typography from 'components/widgets/typography/Typography';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';
import IconButton from 'components/widgets/button/IconButton';
import Guildatar from 'components/guildatar/Guildatar';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import PagePlaceholder from 'components/widgets/page-placeholder/PagePlaceholder';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import './Guildatars.scss';

const CLASS = 'st-Guildatars';

function Guildatars() {
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);
	const guildatars = useSelector(selectGuildatars);
	const {op, total} = useSelector(state => state.guildatars);

	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen(prevState => !prevState);

	useEffect(() => {
		if (data) {
			dispatch(loadGuildatars({user: data.id}, true));
		}
	}, [data, dispatch]);

	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-header'}>
				<div className={CLASS + '-title'}>
					<Typography
						variant={TYPOGRAPHY_VARIANTS.h4}
						component={TYPOGRAPHY_VARIANTS.h4}
						fontWeight={FONT_WEIGHT.bold}
						font={FONTS.merri}
					>
						Collections of your Guildatars
					</Typography>
					<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
						Here you can create and store Guildatars, characters from your stories or
						heroes who help you become a master of writing.
					</Typography>
				</div>

				<div className={CLASS + '-header-action'}>
					{guildatars.length < 3 && op[DEFAULT_OP.loading].success && (
						<IconButton onClick={toggleOpen}>New Guildatar</IconButton>
					)}
				</div>
			</div>
			<LoadMore
				id="guildatars"
				className={CLASS + '-avatars'}
				NoItemsComponent={PagePlaceholder}
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.create].loading}
				showItems={op[DEFAULT_OP.loading].success && !op[DEFAULT_OP.create].loading}
				shouldLoad={false}
				total={total}
				noItemsComponentProps={{
					className: CLASS + '-avatars-placeholder',
					title: 'Create your first Guildatar',
					subtitle:
						'Start building your first Guildatar, a character from your stories or an avatar who represents you',
					buttonLabel: 'Create Guildatar',
					buttonProps: {
						to: undefined,
						tag: undefined,
						onClick: toggleOpen,
					},
				}}
			>
				{guildatars.map(i => (
					<Link
						key={i.id}
						underline={UNDERLINE.none}
						to={goToGuildatar(i.id)}
						className={CLASS + '-avatars-avatar'}
					>
						<Guildatar
							head={getImageUrl(i?.head?.item?.image?.url)}
							face={getImageUrl(i?.face?.item?.image?.url)}
							body={getImageUrl(i?.body?.item?.image?.url)}
							leftArm={getImageUrl(i?.left_arm?.item?.image?.url)}
							rightArm={getImageUrl(i?.right_arm?.item?.image?.url)}
							gender={i.gender?.gender}
						/>
						<Typography fontWeight={FONT_WEIGHT.bold}>{i.name}</Typography>
						<Typography color={TEXT_COLORS.secondary}>{i.description}</Typography>
					</Link>
				))}
			</LoadMore>
			{isOpen && <GuildatarDialog onClose={toggleOpen} isOpen={isOpen} />}
		</MobileWrapper>
	);
}

export default Guildatars;
