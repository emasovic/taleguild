import React, {useState, useEffect, Fragment} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {
	Navbar,
	Nav,
	NavbarBrand,
	NavItem,
	DropdownToggle,
	NavLink,
	DropdownMenu,
	DropdownItem,
	Dropdown,
	Badge,
} from 'reactstrap';

import {COLOR} from 'types/button';
import {USER_STORIES, USER} from 'lib/routes';

import {selectUser} from '../../redux/user';
import {logOutUser} from '../../redux/user';

import {ReactComponent as Logo} from 'images/logo.svg';

import SignUp from '../signup/SignUp';
import Login from '../login/Login';

import Loader from 'components/widgets/loader/Loader';
import IconButton from '../widgets/button/IconButton';
import Image from 'components/widgets/image/Image';

import './Nav.scss';

const CLASS = 'st-Nav';

export default function Navigation() {
	const dispatch = useDispatch();

	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(prevState => !prevState);

	const user = useSelector(selectUser);
	const {data, loading} = user;
	const token = data && data.token;

	const openModal = () => {
		setIsLoginOpen(!isLoginOpen);
		setIsRegisterOpen(!isRegisterOpen);
	};

	useEffect(() => {
		if (token) {
			setIsLoginOpen(false);
			setIsRegisterOpen(false);
		}
	}, [token]);

	const userLoggedOut = () => {
		return (
			<Fragment>
				<NavItem className={CLASS + '-login'} onClick={() => setIsLoginOpen(true)}>
					<NavLink href="#">
						<IconButton>Prijava</IconButton>
					</NavLink>
				</NavItem>
				<NavItem className={CLASS + '-login'} onClick={() => setIsRegisterOpen(true)}>
					<NavLink href="#">
						<IconButton color={COLOR.secondary}>Registracija</IconButton>
					</NavLink>
				</NavItem>
			</Fragment>
		);
	};

	const userLoggedIn = () => {
		const {username, avatar} = data;
		return (
			<>
				<NavItem className={CLASS + '-user'}>
					<Dropdown isOpen={dropdownOpen} toggle={toggle}>
						<DropdownToggle outline caret>
							{avatar ? (
								<Image image={avatar} />
							) : (
								<Badge>{username.slice(0, 1)}</Badge>
							)}
							{username}
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem href={USER}>Profil</DropdownItem>
							<DropdownItem href={USER_STORIES}>Moje priče</DropdownItem>
							<DropdownItem href="/story/new">Nova priča</DropdownItem>
							<DropdownItem onClick={() => dispatch(logOutUser())}>
								Odjavi se
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavItem>
			</>
		);
	};
	return (
		<div className={CLASS}>
			<Navbar>
				<NavbarBrand href="/">
					<Logo />
					<h2>
						Pričaj<span>Mi</span>
					</h2>
				</NavbarBrand>
				<Nav>
					{loading ? <Loader /> : data && data.token ? userLoggedIn() : userLoggedOut()}
				</Nav>
			</Navbar>
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
		</div>
	);
}
