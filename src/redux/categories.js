import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';

const categoryAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.created_at.localeCompare(b.created_at),
});

export const categorySlice = createSlice({
	name: 'categories',
	initialState: categoryAdapter.getInitialState({
		op: DEFAULT_OP.loading,
		pages: null,
		loading: null,
	}),
	reducers: {
		categoriesReceieved: (state, action) => {
			categoryAdapter.setAll(state, action.payload);
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

export const {loadingStart, loadingEnd, categoriesReceieved} = categorySlice.actions;

export const loadCategories = params => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getCategories(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	return dispatch(categoriesReceieved(res));
};

//SELECTORS

const categorySelector = categoryAdapter.getSelectors(state => state.categories);

export const selectCategories = state => categorySelector.selectAll(state);

export default categorySlice.reducer;
