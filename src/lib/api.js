import * as http from './http';

/******************      AUTH        ***********************/

export const loginUser = payload => {
	return http.post('auth/local', null, payload);
};

export const registerUser = payload => {
	return http.post('auth/local/register', null, payload);
};

/******************      USER        ***********************/

export const getUserInfo = token => {
	return http.get('users/me', {token});
};

export const updateUser = (token, payload) => {
	return http.put('/users/' + payload.id, {token}, payload);
};

/******************      STORIES        ***********************/

export const createStory = (token, payload) => {
	return http.post('stories', {token}, payload);
};

export const updateStory = (token, payload) => {
	return http.put('stories/' + payload.id, {token}, payload);
};

export const deleteStory = (token, id) => {
	return http.del('stories/' + id, {token});
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

export const createComment = (token, payload) => {
	return http.post('comments', {token}, payload);
};

/******************      LIKES        ***********************/

export const createLike = (token, payload) => {
	return http.post('likes', {token}, payload);
};

export const deleteLike = (token, id) => {
	return http.del('likes/' + id, {token});
};

/******************      MEDIA        ***********************/

export const uploadMedia = (token, files) => {
	const formData = new FormData();
	files.forEach((file, i) => {
		formData.append('files', file);
	});

	return http.post('upload', {token}, formData);
};
