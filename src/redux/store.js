import {configureStore} from '@reduxjs/toolkit';
import {routerMiddleware} from 'connected-react-router';
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import history from 'lib/history';

import app from './app';
import auth from './auth';
import stories from './story';
import archivedStories from './archivedStories';
import comments from './comments';
import categories from './categories';
import draftStories from './draftStories';
import followers from './followers';
import following from './following';
import guildatars from './guildatars';
import likes from './likes';
import languages from './languages';
import notifications from './notifications';
import marketplace from './marketplace';
import projects from './projects';
import savedStories from './savedStories';
import savedBy from './savedBy';
import storyPages from './storyPages';
import users from './users';
import userStories from './userStories';
import userActivity from './userActivity';
import userItems from './userItems';
import toast from './toast';
import views from './views';
import {gaMiddleware} from './tracking';

const createRootReducer = history =>
	combineReducers({
		auth,
		app,
		archivedStories,
		categories,
		comments,
		draftStories,
		followers,
		following,
		guildatars,
		likes,
		languages,
		notifications,
		marketplace,
		projects,
		stories,
		savedBy,
		storyPages,
		savedStories,
		userActivity,
		userItems,
		userStories,
		users,
		views,
		router: connectRouter(history),
		toast,
	});

const store = configureStore({
	reducer: createRootReducer(history),
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware()
			.concat(routerMiddleware(history))
			.concat(gaMiddleware),
});

export default store;
