import {configureStore} from '@reduxjs/toolkit';
import user from './user';
import users from './users';
import stories from './story';
import toast from './toast';
import drafts from './draft_stories';
import saved_stories from './saved_stories';
import user_stories from './user_stories';
import story_pages from './story_pages';
import followers from './followers';
import following from './following';

export default configureStore({
	reducer: {
		user,
		users,
		followers,
		following,
		stories,
		drafts,
		toast,
		story_pages,
		user_stories,
		saved_stories,
	},
});
