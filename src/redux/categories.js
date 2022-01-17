import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const categoryAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const categorySlice = createSlice({
	name: 'categories',
	initialState: categoryAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
	}),
	reducers: {
		categoriesReceieved: (state, action) => {
			categoryAdapter.setAll(state, action.payload);
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
	},
});

export const {opStart, opEnd, categoriesReceieved} = categorySlice.actions;

export const loadCategories = params => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));
	const res = await api.getCategories(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	return dispatch([categoriesReceieved(res), opEnd({op})]);
};

//SELECTORS

const categorySelector = categoryAdapter.getSelectors(state => state.categories);

export const selectCategories = state => categorySelector.selectAll(state);

export default categorySlice.reducer;
