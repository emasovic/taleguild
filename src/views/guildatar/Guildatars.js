import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {getImageUrl} from 'lib/util';
import {goToGuildatar} from 'lib/routes';

import {selectUser} from 'redux/user';
import {loadGuildatars, selectGuildatars} from 'redux/guildatars';

import Typography from 'components/widgets/typography/Typography';
import GuildatarDialog from 'components/guildatar/GuildatarDialog';
import IconButton from 'components/widgets/button/IconButton';
import Guildatar from 'components/guildatar/Guildatar';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Loader from 'components/widgets/loader/Loader';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import './Guildatars.scss';

const CLASS = 'st-Guildatars';

function Guildatars() {
	const dispatch = useDispatch();

	const {data} = useSelector(selectUser);
	const guildatars = useSelector(selectGuildatars);
	const {op} = useSelector(state => state.guildatars);

	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen(prevState => !prevState);

	useEffect(() => {
		if (data) {
			dispatch(loadGuildatars({user: data.id}));
		}
	}, [data, dispatch]);

	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-header'}>
				<div className={CLASS + '-title'}>
					<Typography
						variant={TYPOGRAPHY_VARIANTS.h4}
						component={TYPOGRAPHY_VARIANTS.h4}
						font={FONTS.merri}
					>
						Space with your Guildatars
					</Typography>
					<Typography variant={TYPOGRAPHY_VARIANTS.action1} color={TEXT_COLORS.secondary}>
						Here you can store and create characters from your stories.
					</Typography>
				</div>

				<div className={CLASS + '-header-action'}>
					{guildatars.length < 3 && (
						<IconButton onClick={toggleOpen}>New Guildatar</IconButton>
					)}
				</div>
			</div>
			<div className={CLASS + '-avatars'}>
				{op ? (
					<Loader />
				) : (
					guildatars.map(i => (
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
							/>
							<Typography fontWeight={FONT_WEIGHT.bold}>{i.name}</Typography>
							<Typography color={TEXT_COLORS.secondary}>{i.description}</Typography>
						</Link>
					))
				)}
			</div>
			{isOpen && <GuildatarDialog onClose={toggleOpen} isOpen={isOpen} />}
		</MobileWrapper>
	);
}

export default Guildatars;
