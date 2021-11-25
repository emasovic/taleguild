import React from 'react';
import {Nav, NavItem, NavLink, Navbar} from 'reactstrap';
import {Link, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useSelector} from 'react-redux';

import {
	DASHBOARD,
	FEED,
	GUILDATAR,
	GUILDATARS,
	HOME,
	LOGIN,
	MARKETPLACE,
	REGISTER,
} from 'lib/routes';

import FA from 'types/font_awesome';

import {COLOR} from 'types/button';

import {selectAuthUser} from 'redux/auth';

import IconButton from 'components/widgets/button/IconButton';

import './MobileNav.scss';

const CLASS = 'st-MobileNav';

export default function MobileNav() {
	const location = useLocation();

	const user = useSelector(selectAuthUser);

	const {data} = user;

	return (
		<>
			<Nav className={CLASS}>
				{data ? (
					<>
						<NavItem>
							<NavLink
								tag={Link}
								to={DASHBOARD}
								active={location.pathname === DASHBOARD}
							>
								<FontAwesomeIcon size="lg" icon={FA.solid_th_large} />
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink tag={Link} to={FEED} active={location.pathname === FEED}>
								<FontAwesomeIcon size="lg" icon={FA.solid_home} />
							</NavLink>
						</NavItem>

						<NavItem>
							<NavLink tag={Link} to={HOME} active={location.pathname === HOME}>
								<FontAwesomeIcon size="lg" icon={FA.compass} />
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								tag={Link}
								to={MARKETPLACE}
								active={location.pathname === MARKETPLACE}
							>
								<FontAwesomeIcon size="lg" icon={FA.solid_store} />
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink
								tag={Link}
								to={GUILDATARS}
								active={location.pathname.includes(GUILDATAR)}
							>
								<FontAwesomeIcon size="lg" icon={FA.solid_user_ninja} />
							</NavLink>
						</NavItem>
					</>
				) : (
					<Navbar>
						<NavItem>
							<IconButton tag={Link} color={COLOR.secondary} to={LOGIN}>
								Sign in
							</IconButton>
						</NavItem>

						<NavItem>
							<IconButton tag={Link} to={REGISTER}>
								Sign up
							</IconButton>
						</NavItem>
					</Navbar>
				)}
			</Nav>
		</>
	);
}
