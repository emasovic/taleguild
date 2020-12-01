import React from 'react';
import {Route, Router, Switch} from 'react-router-dom';

import * as routes from 'lib/routes';
import history from 'lib/history';

import Nav from 'components/nav/Nav';

import Home from 'components/Home';
import Explore from 'components/Explore';

import Story from 'components/stories/Story';
import StoryWritter from 'components/stories/writter/StoryWritter';

import UserProfile from 'components/user/UserProfile';
import UserSettings from 'components/user/UserSettings';
import DraftStoriesPage from 'components/user/pages/DraftStoriesPage';
import SavedStoriesPage from 'components/user/pages/SavedStoriesPage';

import SignUp from 'components/signup/SignUp';

import Login from 'components/login/Login';
import ForgotPassword from 'components/login/ForgotPassword';
import ResetPassword from 'components/login/ResetPassword';
import ProviderLogin from 'components/login/ProviderLogin';

import PrivateRoute from 'PrivateRoute';
import PublicRoute from 'PublicRoute';
import NotFound from 'NotFound';
import DeletedStory from 'DeletedStory';
import Welcome from 'Welcome';

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
			<Route path="*" component={NotFound} />
		</Switch>
	</Router>
);

export default Routes;
