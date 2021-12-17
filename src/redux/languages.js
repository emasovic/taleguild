import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const languageAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const languageSlice = createSlice({
	name: 'languages',
	initialState: languageAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		loading: null,
	}),
	reducers: {
		languagesReceieved: (state, action) => {
			languageAdapter.setAll(state, action.payload);
			state.loading = null;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

export const {loadingStart, loadingEnd, languagesReceieved} = languageSlice.actions;

export const loadLanguages = params => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getLanguages(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(languagesReceieved(res));
};

//SELECTORS

const languagesSelector = languageAdapter.getSelectors(state => state.languages);

export const selectLanguages = state => languagesSelector.selectAll(state);

export default languageSlice.reducer;
