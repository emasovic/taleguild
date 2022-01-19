import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {DEFAULT_OP} from 'types/default';

import {newToast} from './toast';
import {batchDispatch, createOperations, endOperation, startOperation} from './hepler';

const savedByAdapter = createEntityAdapter({
	selectId: entity => entity.id,
});

export const savedBySlice = createSlice({
	name: 'savedBy',
	initialState: savedByAdapter.getInitialState({
		op: createOperations(),
		pages: null,
		loading: null,
		total: 0,
	}),
	reducers: {
		savedByReceieved: (state, action) => {
			savedByAdapter.setAll(state, action.payload);
		},
		savedByUpsertMany: (state, action) => {
			savedByAdapter.upsertMany(state, action.payload);
		},
		opStart: (state, {payload}) => {
			state.op[payload] = startOperation();
		},
		opEnd: (state, {payload}) => {
			state.op[payload.op] = endOperation(payload.error);
		},
		gotPages: (state, {payload}) => {
			state.pages = Math.ceil(payload.total / payload.limit);
			state.total = payload.total;
		},
	},
});

export const {
	loadingStart,
	loadingEnd,
	savedByReceieved,
	savedByUpsertMany,
	gotPages,
	opStart,
	opEnd,
} = savedBySlice.actions;

export const loadSavedBy = (params, op = DEFAULT_OP.loading) => async dispatch => {
	dispatch(opStart(op));
	const res = await api.getSavedStories(params);
	if (res.error) {
		return batchDispatch([
			opEnd({op, error: res.error}, newToast({...Toast.error(res.error)})),
		]);
	}
	const action = !params._start ? savedByReceieved : savedByUpsertMany;

	return batchDispatch([
		gotPages({total: res.total, limit: params._limit}),
		action(res.data),
		opEnd({op}),
	]);
};

//SELECTORS

const savedBySelector = savedByAdapter.getSelectors(state => state.savedBy);

export const selectSavedBy = state => savedBySelector.selectAll(state);

export default savedBySlice.reducer;
