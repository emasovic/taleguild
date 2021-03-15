import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useDispatch, useSelector} from 'react-redux';
import {logOutUser, selectUser} from 'redux/user';
import {
	FEED,
	goToUser,
	HOME,
	LOGIN,
	REGISTER,
	USER_SETTINGS,
	USER_STORIES_DRAFTS,
	USER_STORIES_SAVED,
} from 'lib/routes';
import FA from 'types/font_awesome';
import {ReactComponent as Logo} from 'images/taleguild-logo.svg';
import UserAvatar from 'views/user/UserAvatar';
import Backdrop from 'components/widgets/drawer/Backdrop';
import SideDrawer from 'components/widgets/drawer/SideDrawer';

import './MobileNav.scss';
import {TYPOGRAPHY_LATO, TYPOGRAPHY_MERRI} from 'types/typography';

const CLASS = 'st-MobileNav';

export default function MobileNav() {
	const location = useLocation();
	const dispatch = useDispatch();

	const user = useSelector(selectUser);

	const [isOpen, setIsOpen] = useState(false);
	const {data} = user;

	const toggleDrawer = () => setIsOpen(prevState => !prevState);

	const renderDrawer = () => {
		const displayName = data?.display_name || data?.username;
		return (
			<SideDrawer isOpen={isOpen}>
				<div className={CLASS + '-user'}>
					<UserAvatar user={data} />
					<span className={TYPOGRAPHY_MERRI.placeholder_18_black}>{displayName}</span>
					<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
						@{data?.username}
					</span>
				</div>
				<div className={CLASS + '-items'}>
					<div>
						<NavLink href={goToUser(data && data.username)}>
							<FontAwesomeIcon icon={FA.user} />
							My profile
						</NavLink>
						<NavLink href={USER_STORIES_DRAFTS}>
							<FontAwesomeIcon icon={FA.solid_align_left} />
							Drafts
						</NavLink>
						<NavLink href={USER_STORIES_SAVED}>
							<FontAwesomeIcon icon={FA.bookmark} />
							Saved stories
						</NavLink>
						<NavLink href={USER_SETTINGS}>
							<FontAwesomeIcon icon={FA.solid_cog} />
							Account settings
						</NavLink>
					</div>
					<div>
						<NavLink onClick={() => dispatch(logOutUser())}>
							<FontAwesomeIcon icon={FA.solid_sign_out_alt} />
							Logout
						</NavLink>
					</div>
				</div>
			</SideDrawer>
		);
	};

	return (
		<>
			<Nav className={CLASS}>
				<NavItem>
					<NavLink href={HOME}>
						<Logo width="30" height="30" />
					</NavLink>
				</NavItem>
				{data ? (
					<>
						<NavItem>
							<NavLink href={FEED} active={location.pathname === FEED}>
								<FontAwesomeIcon size="lg" icon={FA.solid_home} />
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink href={HOME} active={location.pathname === HOME}>
								<FontAwesomeIcon size="lg" icon={FA.compass} />
							</NavLink>
						</NavItem>
						<NavItem>
							<UserAvatar user={data} onClick={toggleDrawer} />
						</NavItem>
					</>
				) : (
					<>
						<NavItem>
							<NavLink href={LOGIN} active={location.pathname === LOGIN}>
								<FontAwesomeIcon size="lg" icon={FA.solid_home} />
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink href={REGISTER} active={location.pathname === REGISTER}>
								<FontAwesomeIcon size="lg" icon={FA.compass} />
							</NavLink>
						</NavItem>
					</>
				)}
			</Nav>
			{data && (
				<>
					{isOpen && <Backdrop onClick={toggleDrawer} />}
					{renderDrawer()}
				</>
			)}
		</>
	);
}
