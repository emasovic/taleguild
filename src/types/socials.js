import FA from './font_awesome';

export const SOCIAL_NETWORK_NAMES = {
	discord: 'discord',
	linkedin: 'linkedin',
	facebook: 'facebook',
	instagram: 'instagram',
};

export const SOCIAL_NETWORK_URLS = {
	[SOCIAL_NETWORK_NAMES.discord]: 'https://discord.gg/2TWBgC4RHh',
	[SOCIAL_NETWORK_NAMES.linkedin]: 'https://www.linkedin.com/company/taleguild',
	[SOCIAL_NETWORK_NAMES.facebook]: 'https://www.facebook.com/taleguild/',
	[SOCIAL_NETWORK_NAMES.instagram]: 'https://www.instagram.com/taleguildapp/',
};

export const SOCIAL_NETWORK_ICONS = {
	[SOCIAL_NETWORK_NAMES.discord]: FA.brand_discord,
	[SOCIAL_NETWORK_NAMES.linkedin]: FA.brand_linkedin,
	[SOCIAL_NETWORK_NAMES.facebook]: FA.brand_facebook,
	[SOCIAL_NETWORK_NAMES.instagram]: FA.brand_instagram,
};
