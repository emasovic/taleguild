import React, {lazy, Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'connected-react-router';

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
const ResendConfirmationEmail = lazy(() => import('views/login/ResendConfirmationEmail'));

const TermsOfService = lazy(() => import('views/privacy-terms/TermsOfService'));
const PrivacyPolicy = lazy(() => import('views/privacy-terms/PrivacyPolicy'));

const NotificationsPage = lazy(() => import('components/notifications/NotificationsPage'));

const Marketplace = lazy(() => import('views/marketplace/Marketplace'));

const LandingPage = lazy(() => import('LandingPage'));
const NotFound = lazy(() => import('NotFound'));
const DeletedStory = lazy(() => import('DeletedStory'));
const Welcome = lazy(() => import('Welcome'));
const RegistrationSuccess = lazy(() => import('RegistrationSuccess'));

const Routes = () => (
	<ConnectedRouter history={history}>
		<Suspense fallback={<Loader />}>
			<Nav />
			<Switch>
				<PrivateRoute exact path={routes.DASHBOARD} component={Dashboard} />
				<PrivateRoute path={routes.COMMUNITY} component={Community} />
				<PrivateRoute path={routes.WRITE_STORY} component={StoryWritter} />
				<PrivateRoute path={routes.DELETED_STORY} component={DeletedStory} />
				<Route path={routes.STORY_SLUG} component={Story} />
				<PrivateRoute e path={routes.USER_STORIES_SAVED} component={SavedStoriesPage} />
				<PrivateRoute path={routes.USER_STORIES_DRAFTS} component={DraftStoriesPage} />
				<PrivateRoute path={routes.USER_STORIES_ARCHIVED} component={ArchivedStoriesPage} />
				<PrivateRoute path={routes.USER_SETTINGS} component={UserSettings} />
				<Route path={routes.USER_ID} component={UserProfile} />
				<PublicRoute path={routes.LANDING} component={LandingPage} />
				<PublicRoute path={routes.REGISTER} component={SignUp} />
				<PublicRoute path={routes.LOGIN} component={Login} />
				<PublicRoute path={routes.FORGOT_PASSWORD} component={ForgotPassword} />
				<PublicRoute path={routes.RESET_PASSWORD} component={ResetPassword} />
				<PublicRoute
					path={routes.RESEND_CONFIRMATION_EMAIL}
					component={ResendConfirmationEmail}
				/>
				<Route path={routes.PROVIDER_LOGIN} component={ProviderLogin} />
				<PublicRoute path={routes.WELCOME} component={Welcome} />
				<PublicRoute path={routes.REGISTRATION_SUCCESS} component={RegistrationSuccess} />
				<PrivateRoute path={routes.MARKETPLACE} component={Marketplace} />
				<PrivateRoute path={routes.GUILDATAR_ID} component={GuildatarContainer} />
				<PrivateRoute path={routes.GUILDATARS} component={Guildatars} />
				<PrivateRoute path={routes.GUILDATAR_PLAYGROUND} component={GuildatarPlayground} />
				<PrivateRoute path={routes.NOTIFICATIONS} component={NotificationsPage} />
				<Route path={routes.PRIVACY_POLICY} component={PrivacyPolicy} />
				<Route path={routes.TERMS_OF_SERVICE} component={TermsOfService} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Suspense>
	</ConnectedRouter>
);

export default Routes;
