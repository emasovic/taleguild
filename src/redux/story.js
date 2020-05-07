import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {goToStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {newToast} from './toast';

export const storySlice = createSlice({
	name: 'stories',
	initialState: {
		data: null,
		error: null,
		loading: false,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = helper(action.payload);
			state.error = action.payload.error;
			state.loading = false;
		},
		createStory: (state, action) => {
			state.data.push();
			state.error = action.payload.error;
		},
		gotComment: (state, action) => {
			const {story_id, ...rest} = action.payload;
			state.data[story_id] = {
				...state.data[story_id],
				comments: [...state.data[story_id].comments, {...rest}],
			};
			state.loading = false;
			state.error = action.payload.error;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
		},
		loading: state => {
			state.loading = true;
		},
	},
});

const helper = arr =>
	arr.reduce((map, obj) => {
		map[obj.id] = obj;
		return map;
	}, {});

export const {logOut, hasError, gotData, loading, gotComment, gotPages} = storySlice.actions;

export const createOrUpdateStory = (payload, history) => async (dispatch, getState) => {
	dispatch(loading());
	const state = getState();
	const {user} = state;

	const res = payload.id
		? await api.updateStory(user.data.token, payload)
		: await api.createStory(user.data.token, payload);
	if (res.error) {
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotData([res]));
	const message = payload.id ? 'Uspešno ste izmenili priču.' : 'Uspešno ste kreirali priču.';
	history.push(goToStory(res.id));
	dispatch(newToast({...Toast.success(message)}));
};

export const loadStories = (params, count) => async dispatch => {
	dispatch(loading());
	const res = await api.getStories(params);
	if (count) {
		const res = await api.countStories(params && {user: params.user});
		dispatch(gotPages(Math.ceil(res / 12)));
	}
	return dispatch(gotData(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loading());
	const res = await api.getStory(id);
	if (res.error) {
		dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotData([res]));
};

export const createComment = payload => async (dispatch, getState) => {
	dispatch(loading());
	const state = getState();
	const {user} = state;

	const res = await api.createComment(user.data.token, payload);
	if (res.error) {
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotComment({story_id: payload.story, ...res}));
	dispatch(newToast({...Toast.success('Uspešno ste postavili komentar.')}));
};

//SELECTORS

const stories = state => state.stories.data;

export const selectStories = createSelector([stories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export const selectStory = (state, id) => state.stories.data && state.stories.data[id];

export default storySlice.reducer;
