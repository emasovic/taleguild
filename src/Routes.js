import React, {lazy, Suspense} from 'react';
import {Route, Router, Switch} from 'react-router-dom';

import * as routes from 'lib/routes';
import history from 'lib/history';

import Nav from 'components/nav/Nav';

import PrivateRoute from 'PrivateRoute';
import PublicRoute from 'PublicRoute';

import Loader from 'components/widgets/loader/Loader';
import Helmet from 'components/widgets/helmet/Helmet';

const Home = lazy(() => import('views/Home'));
const Explore = lazy(() => import('views/Explore'));

const Story = lazy(() => import('views/stories/Story'));
const StoryWritter = lazy(() => import('views/stories/writter/StoryWritter'));

const UserProfile = lazy(() => import('views/user/UserProfile'));
const UserSettings = lazy(() => import('views/user/UserSettings'));
const DraftStoriesPage = lazy(() => import('views/user/pages/DraftStoriesPage'));
const SavedStoriesPage = lazy(() => import('views/user/pages/SavedStoriesPage'));

const SignUp = lazy(() => import('views/signup/SignUp'));

const Login = lazy(() => import('views/login/Login'));
const ForgotPassword = lazy(() => import('views/login/ForgotPassword'));
const ResetPassword = lazy(() => import('views/login/ResetPassword'));
const ProviderLogin = lazy(() => import('views/login/ProviderLogin'));

const NotFound = lazy(() => import('NotFound'));
const DeletedStory = lazy(() => import('DeletedStory'));
const Welcome = lazy(() => import('Welcome'));
const RegistrationSuccess = lazy(() => import('RegistrationSuccess'));

const DEFAULT_IMAGE_URL = `${process.env.PUBLIC_URL}/taleguild-share.png`;

const Routes = () => (
	<Router history={history}>
		<Suspense fallback={<Loader />}>
			<Nav />
			<Helmet
				title="Taleguild | Discover the Place with Top Writers"
				description="Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide."
				imageUrl={DEFAULT_IMAGE_URL}
			/>
			<Switch>
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
				<Route path={routes.HOME} component={Explore} />
				<Route path="*" component={NotFound} />
			</Switch>
		</Suspense>
	</Router>
);

export default Routes;
