import {configureStore, applyMiddleware} from '@reduxjs/toolkit';
import user from './user';
import stories from './story';
import toast from './toast';

const hehe = console.log('hehe');
export default configureStore(
	{
		reducer: {
			user,
			stories,
			toast,
		},
	},
	applyMiddleware(hehe)
);
