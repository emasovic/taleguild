import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import history from 'lib/history';

import user from './user';
import users from './users';
import comments from './comments';
import stories from './story';
import toast from './toast';
import draftStories from './draftStories';
import savedStories from './savedStories';
import userStories from './userStories';
import storyPages from './storyPages';
import followers from './followers';
import following from './following';
import categories from './categories';
import languages from './languages';
import application from './application';
import savedBy from './savedBy';
import likes from './likes';

const customizedMiddleware = getDefaultMiddleware({
	thunk: {
		extraArgument: history,
	},
	serializableCheck: false,
});

const store = configureStore({
	reducer: {
		application,
		user,
		users,
		likes,
		followers,
		following,
		stories,
		comments,
		savedBy,
		draftStories,
		toast,
		languages,
		categories,
		storyPages,
		userStories,
		savedStories,
	},
	middleware: customizedMiddleware,
});

export default store;
