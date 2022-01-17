import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {createOperations, endOperation, startOperation} from './hepler';

const languageAdapter = createEntityAdapter({
	selectId: entity => entity.id,
	sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const languageSlice = createSlice({
	name: 'languages',
	initialState: languageAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
	}),
	reducers: {
		languagesReceieved: (state, action) => {
			languageAdapter.setAll(state, action.payload);
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
	},
});

export const {opStart, opEnd, languagesReceieved} = languageSlice.actions;

export const loadLanguages = params => async dispatch => {
	const op = DEFAULT_OP.loading;
	dispatch(opStart(op));
	const res = await api.getLanguages(params);
	if (res.error) {
		return dispatch([opEnd({op, error: res.error}, newToast({...Toast.error(res.error)}))]);
	}

	return dispatch([languagesReceieved(res), opEnd({op})]);
};

//SELECTORS

const languagesSelector = languageAdapter.getSelectors(state => state.languages);

export const selectLanguages = state => languagesSelector.selectAll(state);

export default languageSlice.reducer;
