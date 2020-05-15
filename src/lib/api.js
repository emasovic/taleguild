import * as http from './http';

/******************      AUTH        ***********************/

export const loginUser = payload => {
	return http.post('auth/local', null, payload);
};

export const registerUser = payload => {
	return http.post('auth/local/register', null, payload);
};

export const forgotPassword = payload => {
	return http.post('auth/forgot-password', null, payload);
};

export const resetPassword = payload => {
	return http.post('auth/reset-password', null, payload);
};

/******************      USER        ***********************/

export const getUserInfo = token => {
	return http.get('users/me', {token});
};

export const updateUser = payload => {
	return http.put('/users/' + payload.id, null, payload);
};

/******************      STORIES        ***********************/

export const createStory = payload => {
	return http.post('stories', null, payload);
};

export const updateStory = payload => {
	return http.put('stories/' + payload.id, null, payload);
};

export const deleteStory = id => {
	return http.del('stories/' + id);
};

export const getStories = filter => {
	return http.get('stories', filter);
};

export const countStories = filter => {
	return http.get('stories/count', filter);
};

export const getStory = id => {
	return http.get('stories/' + id);
};

/******************      CATEGORIES        ***********************/

export const getCategories = filter => {
	return http.get('categories', filter);
};

/******************      COMMENTS        ***********************/

export const createComment = payload => {
	return http.post('comments', null, payload);
};

/******************      LIKES        ***********************/

export const createLike = payload => {
	return http.post('likes', null, payload);
};

export const deleteLike = id => {
	return http.del('likes/' + id);
};

/******************      MEDIA        ***********************/

export const uploadMedia = files => {
	const formData = new FormData();
	files.forEach((file, i) => {
		formData.append('files', file);
	});

	return http.post('upload', null, formData);
};
