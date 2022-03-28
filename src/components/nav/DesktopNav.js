import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Navbar, Nav, NavItem, NavLink, DropdownItem} from 'reactstrap';
import {useLocation} from 'react-router-dom';
import PropTypes from 'prop-types';

import {
	USER_STORIES_SAVED,
	USER_SETTINGS,
	USER_STORIES_DRAFTS,
	goToUser,
	USER_STORIES_ARCHIVED,
	MARKETPLACE,
	GUILDATARS,
	DASHBOARD,
	goToWidget,
	_COMMUNITY,
	LOGIN,
	REGISTER,
} from 'lib/routes';
import {kFormatter} from 'lib/util';

import {ICONS} from 'types/icons';
import {TEXT_WRAP} from 'types/typography';
import {COLOR} from 'types/button';
import {SOCIAL_NETWORK_ICONS, SOCIAL_NETWORK_URLS} from 'types/socials';

import {selectAuthUser, logOutUser} from 'redux/auth';
import {newStory} from 'redux/story';

import DropdownButton from 'components/widgets/button/DropdownButton';
import IconButton from 'components/widgets/button/IconButton';
import Notifications from 'components/notifications/Notifications';
import Icon from 'components/widgets/icon/Icon';
import Typography from 'components/widgets/typography/Typography';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import ThemeSwitch from 'components/widgets/theme-switch/ThemeSwitch';

import UserAvatar from 'views/user/UserAvatar';

import {WIDGETS} from 'views/community/Community';

import MobileDrawer from './MobileDrawer';

import './DesktopNav.scss';
import FaIcon from 'components/widgets/fa-icon/FaIcon';

const CLASS = 'st-DesktopNav';
export default function DesktopNav({isMobile}) {
	const dispatch = useDispatch();

	const location = useLocation();

	const {data} = useSelector(selectAuthUser);
	const {stats} = useSelector(state => state.auth);

	const [isOpen, setIsOpen] = useState(false);

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, published_at: null}));
	};

	const userLoggedOut = () => {
		return (
			<NavItem className={CLASS + '-status-signedOut'}>
				{!isMobile && (
					<Link
						to={{pathname: SOCIAL_NETWORK_URLS.discord}}
						underline={UNDERLINE.hover}
						target="_blank"
						className={CLASS + '-status-signedOut-link'}
					>
						<FaIcon icon={SOCIAL_NETWORK_ICONS.discord} />
						Visit us on Discord
					</Link>
				)}

				<Link
					to={LOGIN}
					underline={UNDERLINE.hover}
					className={CLASS + '-status-signedOut-link'}
				>
					Sign in
				</Link>

				<IconButton tag={Link} color={COLOR.secondary} to={REGISTER}>
					Create account
				</IconButton>
			</NavItem>
		);
	};

	const userLoggedIn = () => {
		const dropDownProps = {};

		if (isMobile) {
			dropDownProps.toggle = () => setIsOpen(true);
		}
		return (
			<NavItem className={CLASS + '-status-signedIn'}>
				<Typography className={CLASS + '-status-signedIn-icons'} wrap={TEXT_WRAP.normal}>
					<Icon icon={ICONS.star} size={20} />
					<strong>{kFormatter(stats?.points)}</strong>
				</Typography>

				<Typography className={CLASS + '-status-signedIn-icons'} wrap={TEXT_WRAP.normal}>
					<Icon icon={ICONS.coin} size={20} />
					<strong>{kFormatter(stats?.coins)}</strong>
				</Typography>

				<Notifications isMobile={isMobile} />

				{!isMobile && <ThemeSwitch />}

				<DropdownButton toggleItem={<UserAvatar user={data} />} {...dropDownProps}>
					<DropdownItem tag={Link} to={goToUser(data && data.username)}>
						My profile
					</DropdownItem>
					<DropdownItem tag={Link} to={USER_STORIES_SAVED}>
						Saved stories
					</DropdownItem>
					<DropdownItem tag={Link} to={USER_STORIES_DRAFTS}>
						Drafts
					</DropdownItem>
					<DropdownItem tag={Link} to={USER_STORIES_ARCHIVED}>
						Archived stories
					</DropdownItem>
					<DropdownItem tag={Link} to={USER_SETTINGS}>
						Account settings
					</DropdownItem>
					<DropdownItem href={SOCIAL_NETWORK_URLS.discord} target="_blank">
						Visit us on Discord
					</DropdownItem>
					<DropdownItem
						href="https://www.buymeacoffee.com/taleguildstory"
						target="_blank"
					>
						Buy us a coffee
					</DropdownItem>
					<DropdownItem onClick={() => dispatch(logOutUser())}>Logout</DropdownItem>
				</DropdownButton>

				<IconButton onClick={handleNewStory} className={CLASS + '-status-signedIn-new'}>
					New story
				</IconButton>
			</NavItem>
		);
	};

	return (
		<Navbar className={CLASS}>
			<Nav className={CLASS + '-feed'}>
				<NavItem>
					<NavLink tag={Link} to={DASHBOARD}>
						<Icon icon={ICONS.logo} size={30} />
					</NavLink>
				</NavItem>

				{data && (
					<>
						<NavItem>
							<NavLink
								tag={Link}
								to={DASHBOARD}
								active={location.pathname === DASHBOARD}
							>
								<span>Overview</span>
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink
								tag={Link}
								to={MARKETPLACE}
								active={location.pathname === MARKETPLACE}
							>
								<span>Market</span>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								tag={Link}
								to={GUILDATARS}
								active={location.pathname === GUILDATARS}
							>
								<span>Guildatars</span>
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink
								tag={Link}
								to={goToWidget(WIDGETS.explore)}
								active={location.pathname.includes(_COMMUNITY)}
							>
								<span>Community</span>
							</NavLink>
						</NavItem>
					</>
				)}
			</Nav>

			<Nav className={CLASS + '-status'}>
				{data ? (
					<>
						{userLoggedIn()}
						<MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
					</>
				) : (
					userLoggedOut()
				)}
			</Nav>
		</Navbar>
	);
}

DesktopNav.propTypes = {
	isMobile: PropTypes.bool.isRequired,
};
