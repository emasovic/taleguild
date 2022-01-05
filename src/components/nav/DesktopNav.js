import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Navbar, Nav, NavItem, NavLink, DropdownItem} from 'reactstrap';
import {Link, useLocation} from 'react-router-dom';
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
	LANDING,
} from 'lib/routes';
import {kFormatter} from 'lib/util';

import {ICONS} from 'types/icons';
import {TEXT_WRAP} from 'types/typography';

import {selectAuthUser, logOutUser} from 'redux/auth';
import {newStory} from 'redux/story';

import DropdownButton from 'components/widgets/button/DropdownButton';
import IconButton from 'components/widgets/button/IconButton';
import Notifications from 'components/notifications/Notifications';
import Icon from 'components/widgets/icon/Icon';
import Typography from 'components/widgets/typography/Typography';

import UserAvatar from 'views/user/UserAvatar';

import {WIDGETS} from 'views/community/Community';

import MobileDrawer from './MobileDrawer';

import './DesktopNav.scss';

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
					<DropdownItem
						href="https://www.buymeacoffee.com/taleguildstory"
						target="_blank"
					>
						Buy us a coffee
					</DropdownItem>
					<DropdownItem onClick={() => dispatch(logOutUser())}>Logout</DropdownItem>
				</DropdownButton>

				<IconButton onClick={handleNewStory}>New story</IconButton>
			</NavItem>
		);
	};

	return (
		<Navbar className={CLASS}>
			{data ? (
				<>
					<Nav className={CLASS + '-feed'}>
						<NavItem>
							<NavLink tag={Link} to={DASHBOARD}>
								<Icon icon={ICONS.logo} size={30} />
							</NavLink>
						</NavItem>
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
					</Nav>

					<Nav className={CLASS + '-status'}>
						{userLoggedIn()}
						<MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
					</Nav>
				</>
			) : (
				<NavItem className={CLASS + '-logged-out'}>
					<NavLink tag={Link} to={LANDING}>
						<Icon icon={ICONS.logo} size={30} />
					</NavLink>
				</NavItem>
			)}
		</Navbar>
	);
}

DesktopNav.propTypes = {
	isMobile: PropTypes.bool.isRequired,
};
