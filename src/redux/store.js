import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import storyReducer from './storySlice';

export default configureStore({
	reducer: {
		user: userReducer,
		stories: storyReducer,
	},
});
