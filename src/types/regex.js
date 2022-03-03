export const usernameRegex = {
	regex: /^(?![_.-])(?!.*[_.-]{2})[a-z0-9._-]+(?<![_.-])$/,
	message: 'Valid formats of username: username, user_name, user.name, user-name, username123',
};

export const passwordRegex = {
	regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
	message:
		'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
};
