import {configureStore} from '@reduxjs/toolkit';
import user from './user';
import users from './users';
import stories from './story';
import toast from './toast';
import saved_stories from './saved_stories';
import user_stories from './user_stories';
import drafts from './draft_stories';

export default configureStore({
	reducer: {
		user,
		users,
		stories,
		drafts,
		user_stories,
		saved_stories,
		toast,
	},
});
