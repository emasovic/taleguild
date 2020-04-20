import * as http from './http';

export const loginUser = payload => {
	return http.post('auth/local', null, payload);
};

export const getUserInfo = token => {
	return http.get('users/me', {token});
};

export const createStory = (token, payload) => {
	return http.post('stories', {token}, payload);
};

export const getStories = (token, payload) => {
	return http.get('stories');
};

export const uploadMedia = files => {
	const formData = new FormData();
	files.forEach((file, i) => {
		formData.append(i, file);
	});

	return http.post('upload', null, formData);
};
