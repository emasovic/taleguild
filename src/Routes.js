import React, {lazy, Suspense} from 'react';
import {Route, BrowserRouter as Router, Routes as Switch} from 'react-router-dom';

import * as routes from 'lib/routes';
import history from 'lib/history';

import Nav from 'components/nav/Nav';

import PrivateRoute from 'PrivateRoute';
import PublicRoute from 'PublicRoute';

import Loader from 'components/widgets/loader/Loader';

const Dashboard = lazy(() => import('views/dashboard/Dashboard'));

const Community = lazy(() => import('views/community/Community'));

const Story = lazy(() => import('views/stories/Story'));
const StoryWritter = lazy(() => import('views/stories/writter/StoryWritter'));

const UserProfile = lazy(() => import('views/user/UserProfile'));
const UserSettings = lazy(() => import('views/user/UserSettings'));
const DraftStoriesPage = lazy(() => import('views/user/pages/DraftStoriesPage'));
const SavedStoriesPage = lazy(() => import('views/user/pages/SavedStoriesPage'));
const ArchivedStoriesPage = lazy(() => import('views/user/pages/ArchivedStoriesPage'));

const GuildatarPlayground = lazy(() => import('views/guildatar/GuildatarPlayground'));
const Guildatars = lazy(() => import('views/guildatar/Guildatars'));
const GuildatarContainer = lazy(() => import('views/guildatar/GuildatarContainer'));

const SignUp = lazy(() => import('views/signup/SignUp'));

const Login = lazy(() => import('views/login/Login'));
const ForgotPassword = lazy(() => import('views/login/ForgotPassword'));
const ResetPassword = lazy(() => import('views/login/ResetPassword'));
const ProviderLogin = lazy(() => import('views/login/ProviderLogin'));

const NotificationsPage = lazy(() => import('components/notifications/NotificationsPage'));

const Marketplace = lazy(() => import('views/marketplace/Marketplace'));

const LandingPage = lazy(() => import('LandingPage'));
const NotFound = lazy(() => import('NotFound'));
const DeletedStory = lazy(() => import('DeletedStory'));
const Welcome = lazy(() => import('Welcome'));
const RegistrationSuccess = lazy(() => import('RegistrationSuccess'));

const Routes = () => (
	<Router history={history}>
		<Suspense fallback={<Loader />}>
			<Nav />
			<Switch>
				<Route path={routes.DASHBOARD} element={<PrivateRoute component={Dashboard} />} />
				<Route path={routes.COMMUNITY} element={<PrivateRoute component={Community} />} />
				<Route
					path={routes.WRITE_STORY}
					element={<PrivateRoute component={StoryWritter} />}
				/>
				<Route
					path={routes.DELETED_STORY}
					element={<PrivateRoute component={DeletedStory} />}
				/>
				<Route path={routes.STORY_SLUG} element={<Story />} />
				<Route
					path={routes.USER_STORIES_SAVED}
					element={<PrivateRoute component={SavedStoriesPage} />}
				/>
				<Route
					path={routes.USER_STORIES_DRAFTS}
					element={<PrivateRoute component={DraftStoriesPage} />}
				/>
				<Route
					path={routes.USER_STORIES_ARCHIVED}
					element={<PrivateRoute component={ArchivedStoriesPage} />}
				/>
				<Route
					path={routes.USER_SETTINGS}
					element={<PrivateRoute component={UserSettings} />}
				/>
				<Route path={routes.USER_ID} element={<UserProfile />} />
				<Route path={routes.LANDING} element={<PublicRoute component={LandingPage} />} />
				<Route path={routes.REGISTER} element={<PublicRoute component={SignUp} />} />
				<Route path={routes.LOGIN} element={<PublicRoute component={Login} />} />
				<Route
					path={routes.FORGOT_PASSWORD}
					element={<PublicRoute component={ForgotPassword} />}
				/>
				<Route
					path={routes.RESET_PASSWORD}
					element={<PublicRoute component={ResetPassword} />}
				/>
				<Route path={routes.PROVIDER_LOGIN} element={<ProviderLogin />} />
				<Route path={routes.WELCOME} element={<PublicRoute component={Welcome} />} />
				<Route
					path={routes.REGISTRATION_SUCCESS}
					element={<PublicRoute component={RegistrationSuccess} />}
				/>
				<Route
					path={routes.MARKETPLACE}
					element={<PrivateRoute component={Marketplace} />}
				/>
				<Route
					path={routes.GUILDATAR_ID}
					element={<PrivateRoute component={GuildatarContainer} />}
				/>
				<Route path={routes.GUILDATARS} element={<PrivateRoute component={Guildatars} />} />
				<Route
					path={routes.GUILDATAR_PLAYGROUND}
					element={<PrivateRoute component={GuildatarPlayground} />}
				/>
				<Route
					path={routes.NOTIFICATIONS}
					element={<PrivateRoute component={NotificationsPage} />}
				/>
				<Route path="*" element={<NotFound />} />
			</Switch>
		</Suspense>
	</Router>
);

export default Routes;
