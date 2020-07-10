import {createSlice, createSelector} from '@reduxjs/toolkit';

import * as api from '../lib/api';

import {Toast} from 'types/toast';
import {newToast} from './toast';
import {gotDataHelper} from './hepler';

export const followersSlice = createSlice({
	name: 'followers',
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
			const {data, key, invalidate, gotNew} = action.payload;
			state.data = gotDataHelper(state.data, data, invalidate, key);
			state.loading = false;

			if (gotNew) {
				state.total += 1;
			}
		},
		removeFollower: (state, action) => {
			const {userId, followerId} = action.payload;

			delete state.data[userId][followerId];
			state.total -= 1;
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

export const {loadingStart, loadingEnd, gotData, gotPages, removeFollower} = followersSlice.actions;

export const loadFollowers = (params, count, invalidate) => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getFollowers(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	if (count) {
		const countParams = {...params, _start: undefined, _limit: undefined};

		const res = await api.countFollowers(countParams);
		if (res.error) {
			dispatch(loadingEnd());
			return dispatch(newToast({...Toast.error(res.error)}));
		}
		dispatch(gotPages(res));
	}
	return dispatch(gotData({data: res, key: params.user}));
};

export const loadFollower = params => async dispatch => {
	dispatch(loadingStart());
	const res = await api.getFollowers(params);
	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}
	return dispatch(gotData({data: res}));
};

export const createOrDeleteFollower = (follower, userId, followerId) => async (
	dispatch,
	getState
) => {
	dispatch(loadingStart());
	const res = follower
		? await api.deleteFollower(follower.id)
		: await api.createFollower({user: userId, follower: followerId});

	if (res.error) {
		dispatch(loadingEnd());
		return dispatch(newToast({...Toast.error(res.error)}));
	}

	if (res.id) {
		return dispatch(gotData({data: res, key: userId, gotNew: true}));
	}

	return dispatch(removeFollower({userId, followerId: follower.id}));
};

//SELECTORS

const followers = (state, id) => (state.followers.data ? state.followers.data[id] : null);

export const selectFollowers = createSelector([followers], res =>
	res ? Object.values(res).map(item => item) : null
);

export default followersSlice.reducer;
