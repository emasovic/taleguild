import {configureStore} from '@reduxjs/toolkit';

import history from 'lib/history';

import auth from './auth';
import users from './users';
import comments from './comments';
import stories from './story';
import toast from './toast';
import draftStories from './draftStories';
import savedStories from './savedStories';
import userStories from './userStories';
import archivedStories from './archivedStories';
import userActivity from './userActivity';
import userItems from './userItems';
import storyPages from './storyPages';
import followers from './followers';
import following from './following';
import categories from './categories';
import languages from './languages';
import marketplace from './marketplace';
import application from './application';
import savedBy from './savedBy';
import likes from './likes';
import notifications from './notifications';
import guildatars from './guildatars';

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
		toast,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			thunk: {
				extraArgument: history,
			},
			serializableCheck: false,
		}),
});

export default store;
