import * as http from './http';

/******************      AUTH        ***********************/

export const loginUser = payload => {
	return http.post('auth/local', null, payload);
};

export const loginProvider = (provider, token) => {
	return http.get(`auth/${provider}/callback${token}`, null);
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

export const getUser = id => {
	return http.get('/users/' + id, null);
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

/******************      STORY PAGES        ***********************/

export const createStoryPage = payload => {
	payload = {...payload, text: JSON.stringify(payload.text)};
	return http.post('storypages', null, payload);
};

export const updateStoryPage = payload => {
	payload = {...payload, text: JSON.stringify(payload.text)};
	return http.put('storypages/' + payload.id, null, payload);
};

export const deleteStoryPage = id => {
	return http.del('storypages/' + id);
};

export const getStoryPages = filter => {
	return http.get('storypages', filter);
};

export const countStoryPage = filter => {
	return http.get('storypages/count', filter);
};

export const getStoryPage = id => {
	return http.get('storypages/' + id);
};

/******************     SAVED STORIES        ***********************/

export const getSavedStories = filter => {
	return http.get('savedstories', filter);
};

export const countSavedStories = filter => {
	return http.get('savedstories/count', filter);
};

export const createSavedStory = payload => {
	return http.post('savedstories', null, payload);
};

export const deleteSavedStory = id => {
	return http.del('savedstories/' + id);
};

/******************      CATEGORIES        ***********************/

export const getCategories = filter => {
	return http.get('categories', filter);
};

/******************      LANGUAGES        ***********************/

export const getLanguages = filter => {
	return http.get('languages', filter);
};

/******************      COMMENTS        ***********************/

export const createComment = payload => {
	return http.post('comments', null, payload);
};

export const deleteComment = id => {
	return http.del('comments/' + id);
};

/******************      LIKES        ***********************/

export const createLike = payload => {
	return http.post('likes', null, payload);
};

export const deleteLike = (id, storyId) => {
	return http.del('likes/' + id, {story: storyId});
};

/******************      FOLLOWERS        ***********************/

export const getFollowers = filter => {
	return http.get('followers', filter);
};

export const countFollowers = filter => {
	return http.get('followers/count', filter);
};

export const createFollower = payload => {
	return http.post('followers', null, payload);
};

export const deleteFollower = id => {
	return http.del('followers/' + id);
};

/******************      MEDIA        ***********************/

export const uploadMedia = files => {
	const formData = new FormData();
	files = Array.isArray(files) ? files : [files];
	files.forEach((file, i) => {
		formData.append('files', file);
	});

	return http.post('upload', null, formData);
};
