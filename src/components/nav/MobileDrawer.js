import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'reactstrap';

import {
	goToUser,
	USER_SETTINGS,
	USER_STORIES_ARCHIVED,
	USER_STORIES_DRAFTS,
	USER_STORIES_SAVED,
} from 'lib/routes';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import FA from 'types/font_awesome';

import {logOutUser, selectAuthUser} from 'redux/auth';
import {useDispatch, useSelector} from 'react-redux';

import SideDrawer from 'components/widgets/drawer/SideDrawer';
import Typography from 'components/widgets/typography/Typography';
import Link from 'components/widgets/link/Link';
import FaIcon from 'components/widgets/fa-icon/FaIcon';
import Backdrop from 'components/widgets/drawer/Backdrop';
import ThemeSwitch from 'components/widgets/theme-switch/ThemeSwitch';

import UserAvatar from 'views/user/UserAvatar';

import './MobileDrawer.scss';

const CLASS = 'st-MobileDrawer';

function MobileDrawer({isOpen, onClose}) {
	const dispatch = useDispatch();

	const user = useSelector(selectAuthUser);

	const {data} = user;

	const displayName = data?.display_name || data?.username;

	useEffect(() => {
		return () => {
			onClose();
		};
		// eslint-disable-next-line
	}, []);
	return (
		<>
			{isOpen && <Backdrop onClick={onClose} />}
			<SideDrawer isOpen={isOpen}>
				<div className={CLASS + '-user'}>
					<UserAvatar user={data} />
					<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.p18}>
						{displayName}
					</Typography>
					<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
						@{data?.username}
					</Typography>
					<ThemeSwitch className={CLASS + '-user-theme'} />
				</div>
				<div className={CLASS + '-items'}>
					<div>
						<NavLink tag={Link} onClick={onClose} to={goToUser(data && data.username)}>
							<FaIcon icon={FA.user} />
							My profile
						</NavLink>
						<NavLink tag={Link} onClick={onClose} to={USER_STORIES_SAVED}>
							<FaIcon icon={FA.bookmark} />
							Saved stories
						</NavLink>
						<NavLink tag={Link} onClick={onClose} to={USER_STORIES_DRAFTS}>
							<FaIcon icon={FA.solid_align_left} />
							Drafts
						</NavLink>
						<NavLink tag={Link} onClick={onClose} to={USER_STORIES_ARCHIVED}>
							<FaIcon icon={FA.solid_file_archive} />
							Archived stories
						</NavLink>
						<NavLink tag={Link} onClick={onClose} to={USER_SETTINGS}>
							<FaIcon icon={FA.solid_cog} />
							Account settings
						</NavLink>
					</div>
					<div>
						<NavLink onClick={() => dispatch(logOutUser())}>
							<FaIcon icon={FA.solid_sign_out_alt} />
							Logout
						</NavLink>
					</div>
				</div>
			</SideDrawer>
		</>
	);
}

MobileDrawer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default MobileDrawer;
