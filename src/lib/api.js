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

export const getUser = username => {
	return http.get('/users/username/' + username, null);
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

export const getComments = filter => {
	return http.get('comments', filter);
};

export const createComment = payload => {
	return http.post('comments', null, payload);
};

export const countComments = filter => {
	return http.get('comments/count', filter);
};

export const deleteComment = id => {
	return http.del('comments/' + id);
};

/******************      LIKES        ***********************/

export const getLikes = filter => {
	return http.get('likes', filter);
};

export const createLike = payload => {
	return http.post('likes', null, payload);
};

export const countLikes = filter => {
	return http.get('likes/count', filter);
};

export const deleteLike = id => {
	return http.del('likes/' + id);
};

/******************      VIEWS        ***********************/

export const getViews = filter => {
	return http.get('views', filter);
};

export const countViews = filter => {
	return http.get('views/count', filter);
};

export const createOrUpdateViews = payload => {
	return http.post('views', null, payload);
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

/******************      NOTIFICATIONS        ***********************/

export const getNotifications = filter => {
	return http.get('notifications', filter);
};

export const countNotifications = filter => {
	return http.get('notifications/count', filter);
};

export const updateNotifications = payload => {
	return http.put('/notifications', null, payload);
};

export const updateNotification = payload => {
	return http.put('/notifications/' + payload.id, null, payload);
};

/******************      USER ACTIVITY        ***********************/

export const getActivity = filter => {
	return http.get('user-activities', filter);
};

export const countActivity = filter => {
	return http.get('user-activities/count', filter);
};

export const createActivity = payload => {
	return http.post('user-activities', null, payload);
};

/******************      USER ITEMS        ***********************/
export const createUserItem = payload => {
	return http.post('user-items', null, payload);
};

export const getUserItems = filter => {
	return http.get('user-items', filter);
};

export const countUserItems = filter => {
	return http.get('user-items/count', filter);
};

/******************      MARKETPLACE        ***********************/

export const getMarketplace = filter => {
	return http.get('marketplace', filter);
};

export const countMarketplace = filter => {
	return http.get('marketplace/count', filter);
};

/******************      GUILDATARS        ***********************/

export const createGuildatar = payload => {
	return http.post('guildatars', null, payload);
};

export const updateGuildatar = payload => {
	return http.put('guildatars/' + payload.id, null, payload);
};

export const deleteGuildatar = id => {
	return http.del('guildatars/' + id);
};

export const getGuildatars = filter => {
	return http.get('guildatars', filter);
};

export const countGuildatars = filter => {
	return http.get('guildatars/count', filter);
};

export const getGuildatar = id => {
	return http.get('guildatars/' + id);
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
