import React from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {Link, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useDispatch, useSelector} from 'react-redux';

import {DASHBOARD, goToWidget, GUILDATAR, GUILDATARS, MARKETPLACE, _COMMUNITY} from 'lib/routes';

import FA from 'types/font_awesome';

import {selectAuthUser} from 'redux/auth';
import {newStory} from 'redux/story';

import {WIDGETS} from 'views/community/Community';

import IconButton from 'components/widgets/button/IconButton';

import './MobileNav.scss';

const CLASS = 'st-MobileNav';

export default function MobileNav() {
	const location = useLocation();
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, publishedAt: null}));
	};

	return (
		data && (
			<Nav className={CLASS}>
				<NavItem>
					<NavLink
						tag={Link}
						to={DASHBOARD}
						active={location.pathname === DASHBOARD}
						className={CLASS + '-item'}
					>
						<FontAwesomeIcon size="lg" icon={FA.solid_th_large} />
					</NavLink>
				</NavItem>

				<NavItem>
					<NavLink
						tag={Link}
						to={MARKETPLACE}
						active={location.pathname === MARKETPLACE}
						className={CLASS + '-item'}
					>
						<FontAwesomeIcon size="lg" icon={FA.solid_store} />
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink tag={IconButton} onClick={handleNewStory} icon={FA.solid_plus} />
				</NavItem>
				<NavItem>
					<NavLink
						tag={Link}
						to={GUILDATARS}
						active={location.pathname.includes(GUILDATAR)}
						className={CLASS + '-item'}
					>
						<FontAwesomeIcon size="lg" icon={FA.solid_user_ninja} />
					</NavLink>
				</NavItem>
				<NavItem>
					<NavLink
						tag={Link}
						to={goToWidget(WIDGETS.explore)}
						active={location.pathname.includes(_COMMUNITY)}
						className={CLASS + '-item'}
					>
						<FontAwesomeIcon size="lg" icon={FA.solid_users} />
					</NavLink>
				</NavItem>
			</Nav>
		)
	);
}
