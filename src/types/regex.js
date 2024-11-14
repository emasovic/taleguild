export const usernameRegex = {
	regex: /^(?![_.-])(?!.*[_.-]{2})[a-z0-9._-]+(?<![_.-])$/,
	message: 'Valid formats of username: username, user_name, user.name, user-name, username123',
};

export const passwordRegex = {
	regex: /^((?=\S*?[0-9]).{7,})\S$/,
	message: 'Password must contain at least 8 characters, one number and without spaces',
};
