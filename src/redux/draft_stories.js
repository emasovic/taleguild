import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';
import {goToStory} from '../lib/routes';

import {Toast} from 'types/toast';
import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const draftSlice = createSlice({
	name: 'drafts',
	initialState: {
		data: null,
		error: null,
		loading: false,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			state.data = gotDataHelper(state.data, action.payload);
			state.loading = false;
		},
		removeStory: (state, action) => {
			delete state.data[action.payload];
			state.loading = false;
		},
		gotPages: (state, action) => {
			state.pages = action.payload;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

export const {loadingStart, loadingEnd, gotData, gotPages, removeStory} = draftSlice.actions;

export const createOrUpdateStory = (payload, history) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const res = payload.id ? await api.updateStory(payload) : await api.createStory(payload);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(gotData([res]));
	const message = payload.id ? 'Uspešno ste izmenili priču.' : 'Uspešno ste kreirali priču.';
	history.push(goToStory(res.id));
	dispatch(newToast({...Toast.success(message)}));
};

export const deleteStory = (storyId, history) => async (dispatch, getState) => {
	dispatch(loadingStart());

	const res = await api.deleteStory(storyId);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	dispatch(removeStory(storyId));
	// history.push(USER_STORIES);
	dispatch(newToast({...Toast.success('Uspešno ste obrisali priču.')}));
};

export const loadStories = (params, count) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getStories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
	}
	if (count) {
		const res = await api.countStories(
			params && {user: params.user, published: params.published}
		);
		if (res.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error('Došlo je do greške!')}));
		}
		dispatch(gotPages(Math.ceil(res / 12)));
	}
	return dispatch(gotData(res));
};

export const loadStory = id => async dispatch => {
	dispatch(loadingStart());

	const res = await api.getStory(id);

	if (res.error) {
		dispatch(loadingEnd());
		dispatch(newToast({...Toast.error(res.error)}));
	}
	dispatch(gotData([res]));
};

//SELECTORS

const stories = state => state.drafts.data;

export const selectStories = createSelector([stories], res =>
	res
		? Object.values(res)
				.map(item => item)
				.sort((a, b) => b.id - a.id)
		: null
);

export const selectStory = (state, id) => state.drafts.data && state.drafts.data[id];

export default draftSlice.reducer;
