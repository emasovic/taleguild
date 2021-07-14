import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Navbar, Nav, NavItem, NavLink, DropdownItem} from 'reactstrap';
import {useLocation} from 'react-router-dom';

import {COLOR} from 'types/button';
import {
	USER_STORIES_SAVED,
	USER_SETTINGS,
	USER_STORIES_DRAFTS,
	goToUser,
	HOME,
	FEED,
	REGISTER,
	LOGIN,
} from 'lib/routes';

import {selectUser, logOutUser} from '../../redux/user';
import {newStory} from 'redux/story';

import {ReactComponent as Logo} from 'images/taleguild-logo.svg';

import StoryPicker from 'components/widgets/pickers/story/StoryPicker';
import DropdownButton from 'components/widgets/button/DropdownButton';

import UserAvatar from 'views/user/UserAvatar';
import IconButton from '../widgets/button/IconButton';

import './DesktopNav.scss';

const CLASS = 'st-DesktopNav';

export default function Navigation() {
	const dispatch = useDispatch();

	const location = useLocation();

	const user = useSelector(selectUser);
	const {data} = user;

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, published_at: null}));
	};

	const userLoggedOut = () => {
		return (
			<NavItem className={CLASS + '-status-signedOut'}>
				<IconButton color={COLOR.secondary} href={LOGIN}>
					Sign in
				</IconButton>

				<IconButton href={REGISTER}>Sign up</IconButton>
			</NavItem>
		);
	};

	const userLoggedIn = () => {
		return (
			<NavItem className={CLASS + '-status-signedIn'}>
				<IconButton onClick={handleNewStory}>New story</IconButton>

				<DropdownButton toggleItem={<UserAvatar user={data} />}>
					<DropdownItem href={goToUser(data && data.username)}>My profile</DropdownItem>
					<DropdownItem href={USER_STORIES_DRAFTS}>Drafts</DropdownItem>
					<DropdownItem href={USER_STORIES_SAVED}>Saved stories</DropdownItem>
					<DropdownItem href={USER_SETTINGS}>Account settings</DropdownItem>
					<DropdownItem
						href="https://www.buymeacoffee.com/taleguildstory"
						target="_blank"
					>
						Buy us a coffee
					</DropdownItem>
					<DropdownItem onClick={() => dispatch(logOutUser())}>Logout</DropdownItem>
				</DropdownButton>
			</NavItem>
		);
	};

	return (
		<Navbar className={CLASS}>
			<Nav className={CLASS + '-feed'}>
				<NavItem>
					<NavLink href={HOME}>
						<Logo width="30" height="30" />
					</NavLink>
				</NavItem>
				{data && (
					<>
						<NavItem>
							<NavLink href={FEED} active={location.pathname === FEED}>
								<span>Feed</span>
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink href={HOME} active={location.pathname === HOME}>
								<span>Explore</span>
							</NavLink>
						</NavItem>
					</>
				)}
			</Nav>

			<StoryPicker placeholder="Search for stories" />

			<Nav className={CLASS + '-status'}>
				{data && data.token ? userLoggedIn() : userLoggedOut()}
			</Nav>
		</Navbar>
	);
}
