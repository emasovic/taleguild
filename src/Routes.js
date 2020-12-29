import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';

import * as routes from 'lib/routes';
import history from 'lib/history';

import Nav from 'components/nav/Nav';

import Home from 'views/Home';
import Explore from 'views/Explore';

import Story from 'views/stories/Story';
import StoryWritter from 'views/stories/writter/StoryWritter';

import UserProfile from 'views/user/UserProfile';
import UserSettings from 'views/user/UserSettings';
import DraftStoriesPage from 'views/user/pages/DraftStoriesPage';
import SavedStoriesPage from 'views/user/pages/SavedStoriesPage';

import SignUp from 'views/signup/SignUp';

import Login from 'views/login/Login';
import ForgotPassword from 'views/login/ForgotPassword';
import ResetPassword from 'views/login/ResetPassword';
import ProviderLogin from 'views/login/ProviderLogin';

import PrivateRoute from 'PrivateRoute';
import PublicRoute from 'PublicRoute';
import NotFound from 'NotFound';
import DeletedStory from 'DeletedStory';
import Welcome from 'Welcome';
import RegistrationSuccess from 'RegistrationSuccess';

const Routes = () => (
	<Router history={history}>
		<Nav />
		<Switch>
			<Route exact path={routes.HOME} component={Explore} />
			<PrivateRoute path={routes.FEED} component={Home} />
			<PrivateRoute path={routes.WRITE_STORY} component={StoryWritter} />
			<PrivateRoute path={routes.DELETED_STORY} component={DeletedStory} />
			<Route path={routes.STORY_SLUG} component={Story} />
			<PrivateRoute path={routes.USER_STORIES_SAVED} component={SavedStoriesPage} />
			<PrivateRoute path={routes.USER_STORIES_DRAFTS} component={DraftStoriesPage} />
			<PrivateRoute path={routes.USER_SETTINGS} component={UserSettings} />
			<Route path={routes.USER_ID} component={UserProfile} />
			<PublicRoute path={routes.REGISTER} component={SignUp} />
			<PublicRoute path={routes.LOGIN} component={Login} />
			<PublicRoute path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
			<PublicRoute path={routes.RESET_PASSWORD} component={ResetPassword} />
			<Route path={routes.PROVIDER_LOGIN} component={ProviderLogin} />
			<PublicRoute path={routes.WELCOME} component={Welcome} />
			<PublicRoute path={routes.REGISTRATION_SUCCESS} component={RegistrationSuccess} />
			<Route path="*" component={NotFound} />
		</Switch>
	</Router>
);

export default Routes;
