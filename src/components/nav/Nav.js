import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {Navbar, Nav, NavItem, NavLink, DropdownItem} from 'reactstrap';
import {useHistory, useLocation} from 'react-router-dom';

import FA from 'types/font_awesome';
import {COLOR} from 'types/button';
import {
	USER_STORIES_SAVED,
	USER_SETTINGS,
	USER_STORIES_DRAFTS,
	goToUser,
	HOME,
	FEED,
} from 'lib/routes';

import {selectUser, logOutUser} from '../../redux/user';
import {newStory} from 'redux/story';

import {ReactComponent as Logo} from 'images/taleguild-logo.svg';

import SignUp from '../signup/SignUp';
import Login from '../login/Login';

import StoryPicker from 'components/widgets/pickers/story/StoryPicker';
import DropdownButton from 'components/widgets/button/DropdownButton';

import UserAvatar from 'components/user/UserAvatar';
import IconButton from '../widgets/button/IconButton';

import './Nav.scss';

const CLASS = 'st-Nav';

export default function Navigation() {
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();

	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);

	const user = useSelector(selectUser);
	const {data} = user;
	const token = data && data.token;

	const openModal = () => {
		setIsLoginOpen(!isLoginOpen);
		setIsRegisterOpen(!isRegisterOpen);
	};

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, published: false}, history));
	};

	useEffect(() => {
		if (token) {
			setIsLoginOpen(false);
			setIsRegisterOpen(false);
		}
	}, [token]);

	const userLoggedOut = () => {
		return (
			<NavItem className={CLASS + '-status-signedOut'}>
				<IconButton color={COLOR.secondary} onClick={() => setIsLoginOpen(true)}>
					Sign in
				</IconButton>

				<IconButton onClick={() => setIsRegisterOpen(true)}>Sign up</IconButton>
			</NavItem>
		);
	};

	const userLoggedIn = () => {
		return (
			<NavItem className={CLASS + '-status-signedIn'}>
				<IconButton
					href="https://www.buymeacoffee.com/taleguildstory"
					target="_blank"
					icon={FA.solid_coffee}
					color={COLOR.secondary}
				>
					Buy us a coffee
				</IconButton>
				<IconButton onClick={handleNewStory}>New story</IconButton>

				<DropdownButton toggleItem={<UserAvatar user={data} />}>
					<DropdownItem href={goToUser(data && data.id)}>My profile</DropdownItem>
					<DropdownItem href={USER_STORIES_DRAFTS}>Drafts</DropdownItem>
					<DropdownItem href={USER_STORIES_SAVED}>Saved stories</DropdownItem>
					<DropdownItem href={USER_SETTINGS}>Account settings</DropdownItem>
					<DropdownItem onClick={() => dispatch(logOutUser())}>Logout</DropdownItem>
				</DropdownButton>
			</NavItem>
		);
	};

	const renderNavBar = () => {
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
									<FontAwesomeIcon icon={FA.solid_home} />
									<span>Feed</span>
								</NavLink>
							</NavItem>

							<NavItem>
								<NavLink href={HOME} active={location.pathname === HOME}>
									<FontAwesomeIcon icon={FA.compass} />
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
	};
	return (
		<>
			{renderNavBar()}
			{isRegisterOpen && (
				<SignUp
					open={isRegisterOpen}
					onChange={openModal}
					onClose={() => setIsRegisterOpen(false)}
				/>
			)}
			{isLoginOpen && (
				<Login
					open={isLoginOpen}
					onChange={openModal}
					onClose={() => setIsLoginOpen(false)}
				/>
			)}
		</>
	);
}
