import React, {useState, Fragment} from 'react';

import {useDispatch} from 'react-redux';
import {logOutUser} from '../../redux/userSlice';

import {
	Navbar,
	Nav,
	NavbarBrand,
	NavItem,
	DropdownToggle,
	NavLink,
	DropdownMenu,
	DropdownItem,
	UncontrolledDropdown,
} from 'reactstrap';
import {useSelector} from 'react-redux';

import {ReactComponent as Burger} from 'images/icons/burger.svg';
import {ReactComponent as Logo} from 'images/logo.svg';
import {selectUser} from '../../redux/userSlice';

import SignUp from '../signup/SignUp';
// import UserProfile from '../user/UserProfile';
import Login from '../login/Login';

import IconButton from '../widgets/button/IconButton';

import './Nav.scss';

const CLASS = 'st-Nav';

export default function Navigation() {
	const dispatch = useDispatch();

	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isDropDownOpen, setIsDropDownOpen] = useState(false);

	const user = useSelector(selectUser);
	const userLoggedOut = () => {
		return (
			<Fragment>
				<NavItem className={CLASS + '-login'} onClick={() => setIsLoginOpen(true)}>
					<NavLink href="#">Login</NavLink>
				</NavItem>
				<span>OR</span>
				<NavItem className={CLASS + '-login'} onClick={() => setIsRegisterOpen(true)}>
					<NavLink href="#">Register</NavLink>
				</NavItem>
			</Fragment>
		);
	};

	const userLoggedIn = () => {
		const {username} = user;
		return (
			<>
				<NavItem>
					<NavLink href="/story/new">Napisite pricu</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#">Sacuvane</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#">Poslednje vidjeno</NavLink>
				</NavItem>
				<NavItem className={CLASS + '-user'}>
					<UncontrolledDropdown setActiveFromChild>
						<DropdownToggle tag="a" className="nav-link" caret>
							{username}
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem tag="a" href="/blah">
								Profile
							</DropdownItem>
							<DropdownItem tag="a" href="/blah">
								Settings
							</DropdownItem>
							<DropdownItem tag="a" onClick={() => dispatch(logOutUser())}>
								Logout
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
					{/* <img src={avatar} alt="avatar" /> */}
				</NavItem>
			</>
		);
	};
	return (
		<div className={CLASS}>
			<Navbar>
				<Nav>
					<NavItem>
						<Burger />
					</NavItem>
				</Nav>
				<NavbarBrand href="/">
					<Logo />
					<h1>
						Pricaj<span>Mi</span>
					</h1>
				</NavbarBrand>
				<Nav>{user ? userLoggedIn() : userLoggedOut()}</Nav>
			</Navbar>
			{isRegisterOpen && (
				<SignUp open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
			)}
			{isLoginOpen && (
				<Login
					open={isLoginOpen}
					onClose={() => setIsLoginOpen(false)}
					// onSuccess={this.handleLoginSuccess}
				/>
			)}
			{/* {user && isUserOpen && (
				<UserProfile
					open={isUserOpen}
					onClose={() => this.handleChange(false, 'isUserOpen')}
				/>
			)} */}
		</div>
	);
}
