import {configureStore} from '@reduxjs/toolkit';
import {reduxBatch} from '@manaflair/redux-batch';

import history from 'lib/history';

import application from './application';
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
import savedStories from './savedStories';
import savedBy from './savedBy';
import storyPages from './storyPages';
import users from './users';
import userStories from './userStories';
import userActivity from './userActivity';
import userItems from './userItems';
import toast from './toast';
import views from './views';

const store = configureStore({
	reducer: {
		auth,
		application,
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
		stories,
		savedBy,
		storyPages,
		savedStories,
		userActivity,
		userItems,
		userStories,
		users,
		views,
		toast,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: history,
			},
			serializableCheck: false,
		}),
	enhancers: [reduxBatch],
});

export default store;
