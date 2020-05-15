import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import * as routes from 'lib/routes';

import {getUser} from './redux/user';

import Nav from 'components/nav/Nav';

import Stories from 'components/stories/Stories';
import NewStory from 'components/stories/NewStory';
import Story from 'components/stories/Story';
import EditStory from 'components/stories/EditStory';

import UserProfile from 'components/user/UserProfile';
import MyStories from 'components/user/MyStories';

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
				<Route exact path={routes.HOME} component={Stories} />
				<PrivateRoute path={routes.NEW_STORY} component={NewStory} />
				<PrivateRoute path={routes.EDIT_STORY} component={EditStory} />
				<Route path={routes.STORY_ID} component={Story} />
				<PrivateRoute path={routes.USER_STORIES} component={MyStories} />
				<PrivateRoute path={routes.USER} component={UserProfile} />
				<Route path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
				<Route path={routes.RESET_PASSWORD} component={ResetPassword} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
