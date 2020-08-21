import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import history from 'lib/history';

import user from './user';
import users from './users';
import stories from './story';
import toast from './toast';
import draft_stories from './draft_stories';
import saved_stories from './saved_stories';
import user_stories from './user_stories';
import story_pages from './story_pages';
import followers from './followers';
import following from './following';
import categories from './categories';
import languages from './languages';
import application from './application';

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
		followers,
		following,
		stories,
		draft_stories,
		toast,
		languages,
		categories,
		story_pages,
		user_stories,
		saved_stories,
	},
	middleware: customizedMiddleware,
});

export default store;
