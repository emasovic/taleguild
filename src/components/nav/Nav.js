import React, {useState, Fragment} from 'react';
import {Navbar, Nav, NavbarBrand, NavItem, NavLink} from 'reactstrap';
import {useSelector} from 'react-redux';

import logo from '../../images/logo.svg';

import {selectUser} from '../../redux/userSlice';

// import SignUp from '../signup/SignUp';
// import UserProfile from '../user/UserProfile';
import Login from '../login/Login';

import IconButton from '../widgets/button/IconButton';

import './Nav.scss';

const CLASS = 'st-Nav';

export default function Navigation() {
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const user = useSelector(selectUser);
	const userLoggedOut = () => {
		return (
			<Fragment>
				<NavItem className={CLASS + '-login'} onClick={() => setIsLoginOpen(true)}>
					<NavLink href="#">Login</NavLink>
				</NavItem>
				<NavItem>
					<IconButton onClick={() => this.handleChange(true, 'isRegisterOpen')}>
						New Account
					</IconButton>
				</NavItem>
			</Fragment>
		);
	};

	const userLoggedIn = () => {
		const {username} = user;
		return (
			<NavItem className={CLASS + '-user'} onClick={() => this.handleChange(true, 'isUserOpen')}>
				<NavLink href="#">
					<span>{username}</span>
					{/* <img src={avatar} alt="avatar" /> */}
				</NavLink>
			</NavItem>
		);
	};
	return (
		<div className={CLASS}>
			<Navbar>
				<NavbarBrand href="/">
					<img src={logo} className="App-logo" alt="logo" />
				</NavbarBrand>
				<Nav>
					<NavItem>
						<NavLink href="/story/new">Create Story</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">Latest Sightings</NavLink>
					</NavItem>
					<NavItem>
						<NavLink href="#">Favorites</NavLink>
					</NavItem>
					{user ? userLoggedIn() : userLoggedOut()}
				</Nav>
			</Navbar>
			{/* {isRegisterOpen && (
				<SignUp
					open={isRegisterOpen}
					onClose={() => this.handleChange(false, 'isRegisterOpen')}
					onSuccess={this.handleRegisterSuccess}
				/>
			)} */}
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
