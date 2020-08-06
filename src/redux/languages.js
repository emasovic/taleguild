import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const languageSlice = createSlice({
	name: 'languages',
	initialState: {
		data: null,
		error: null,
		loading: false,
		op: null,
		total: null,
		pages: null,
	},
	reducers: {
		gotData: (state, action) => {
			const {data, invalidate} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate);
			state.loading = false;
		},
		gotPages: (state, action) => {
			state.pages = Math.ceil(action.payload / 10);
			state.total = action.payload;
		},
		loadingStart: state => {
			state.loading = true;
		},
		loadingEnd: state => {
			state.loading = false;
		},
	},
});

export const {loadingStart, loadingEnd, gotData, gotPages} = languageSlice.actions;

export const loadLanguages = (params, count, invalidate) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getLanguages(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	// if (count) {
	// 	const countParams = {...params, _start: undefined, _limit: undefined};

	// 	const res = await api.coutlanguages(countParams);
	// 	if (res.error) {
	// 		dispatch(loadingEnd());
	// 		return dispatch(newToast({...Toast.error(res.error)}));
	// 	}
	// 	dispatch(gotPages(res));
	// }
	return dispatch(gotData({data: res}));
};

//SELECTORS

const languages = state => state.languages.data;

export const selectLanguages = createSelector([languages], res =>
	res ? Object.values(res).map(item => item) : []
);

export default languageSlice.reducer;
