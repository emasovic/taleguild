import React, {lazy, Suspense} from 'react';
import {Route, Router, Switch} from 'react-router-dom';

import * as routes from 'lib/routes';
import history from 'lib/history';

import Nav from 'components/nav/Nav';

import PrivateRoute from 'PrivateRoute';
import PublicRoute from 'PublicRoute';

import Loader from 'components/widgets/loader/Loader';

const Home = lazy(() => import('views/Home'));
const Explore = lazy(() => import('views/Explore'));

const Story = lazy(() => import('views/stories/Story'));
const StoryWritter = lazy(() => import('views/stories/writter/StoryWritter'));

const UserProfile = lazy(() => import('views/user/UserProfile'));
const UserSettings = lazy(() => import('views/user/UserSettings'));
const DraftStoriesPage = lazy(() => import('views/user/pages/DraftStoriesPage'));
const SavedStoriesPage = lazy(() => import('views/user/pages/SavedStoriesPage'));
const ArchivedStoriesPage = lazy(() => import('views/user/pages/ArchivedStoriesPage'));

const GuildatarPage = lazy(() => import('views/guildatar/GuildatarPage'));

const SignUp = lazy(() => import('views/signup/SignUp'));

const Login = lazy(() => import('views/login/Login'));
const ForgotPassword = lazy(() => import('views/login/ForgotPassword'));
const ResetPassword = lazy(() => import('views/login/ResetPassword'));
const ProviderLogin = lazy(() => import('views/login/ProviderLogin'));

const NotificationsPage = lazy(() => import('components/notifications/NotificationsPage'));

const Marketplace = lazy(() => import('views/marketplace/Marketplace'));

const NotFound = lazy(() => import('NotFound'));
const DeletedStory = lazy(() => import('DeletedStory'));
const Welcome = lazy(() => import('Welcome'));
const RegistrationSuccess = lazy(() => import('RegistrationSuccess'));

const Routes = () => (
	<Router history={history}>
		<Suspense fallback={<Loader />}>
			<Nav />
			<Switch>
				<PrivateRoute path={routes.FEED} component={Home} />
				<PrivateRoute path={routes.WRITE_STORY} component={StoryWritter} />
				<PrivateRoute path={routes.DELETED_STORY} component={DeletedStory} />
				<Route path={routes.STORY_SLUG} component={Story} />
				<PrivateRoute e path={routes.USER_STORIES_SAVED} component={SavedStoriesPage} />
				<PrivateRoute path={routes.USER_STORIES_DRAFTS} component={DraftStoriesPage} />
				<PrivateRoute path={routes.USER_STORIES_ARCHIVED} component={ArchivedStoriesPage} />
				<PrivateRoute path={routes.USER_SETTINGS} component={UserSettings} />
				<Route path={routes.USER_ID} component={UserProfile} />
				<PublicRoute path={routes.REGISTER} component={SignUp} />
				<PublicRoute path={routes.LOGIN} component={Login} />
				<PublicRoute path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
				<PublicRoute path={routes.RESET_PASSWORD} component={ResetPassword} />
				<Route path={routes.PROVIDER_LOGIN} component={ProviderLogin} />
				<PublicRoute path={routes.WELCOME} component={Welcome} />
				<PublicRoute path={routes.REGISTRATION_SUCCESS} component={RegistrationSuccess} />
				<Route exact path={routes.HOME} component={Explore} />
				<PrivateRoute path={routes.MARKETPLACE} component={Marketplace} />
				<PrivateRoute path={routes.GUILDATAR} component={GuildatarPage} />
				<PrivateRoute path={routes.NOTIFICATIONS} component={NotificationsPage} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Suspense>
	</Router>
);

export default Routes;
