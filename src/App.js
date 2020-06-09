import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import * as routes from 'lib/routes';

import {getUser} from './redux/user';

import Nav from 'components/nav/Nav';

import Home from 'components/Home';

import Story from 'components/stories/Story';
import Writter from 'components/stories/writter/Writter';

import UserProfile from 'components/user/UserProfile';
import UserSettings from 'components/user/UserSettings';
import DraftStoriesPage from 'components/user/pages/DraftStoriesPage';
import SavedStoriesPage from 'components/user/pages/SavedStoriesPage';

import ForgotPassword from 'components/login/ForgotPassword';
import ResetPassword from 'components/login/ResetPassword';

import PrivateRoute from 'PrivateRoute';
import NotFound from 'NotFound';


function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return (
		<Router>
			<Nav />
			<Switch>
				<Route exact path={routes.HOME} component={Home} />
				<PrivateRoute path={routes.WRITE_STORY} component={Writter} />
				<Route path={routes.STORY_ID} component={Story} />
				<PrivateRoute path={routes.USER_STORIES_SAVED} component={SavedStoriesPage} />
				<PrivateRoute path={routes.USER_STORIES_DRAFTS} component={DraftStoriesPage} />
				<PrivateRoute path={routes.USER_SETTINGS} component={UserSettings} />
				<Route path={routes.USER_ID} component={UserProfile} />
				<Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
				<Route path={routes.RESET_PASSWORD} component={ResetPassword} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
