import {configureStore} from '@reduxjs/toolkit';
import user from './user';
import stories from './story';
import toast from './toast';

export default configureStore({
	reducer: {
		user,
		stories,
		toast,
	},
});
