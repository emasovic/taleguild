import axios from 'axios';
import qs from 'qs';

import {detectIE} from './util';

export const getHeaders = (method, onlyAuth = false) => {
	let headers = {};
	if (onlyAuth) {
		return headers;
	}
	if (method === 'post' || method === 'put') {
		headers['Content-Type'] = 'application/json';
	}

	// Deal with IE aggressive caching
	// http://stackoverflow.com/questions/2848945/prevent-ie-caching
	if (detectIE() && method === 'get') {
		headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
		headers['Pragma'] = 'no-cache';
		headers['Expires'] = '0';
	}
	return headers;
};

export const request = opts => {
	if (!opts.url) {
		throw new Error('url is required');
	}

	opts.baseURL = process.env.REACT_APP_API_URL.concat('/api');
	opts.method = opts.method || 'get';

	const headers = opts.headers;
	opts.headers = getHeaders(opts.method);

	if (localStorage.getItem('token')) {
		opts.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
	}

	if (headers) {
		opts.headers = {
			...opts.headers,
			...headers,
		};
	}

	opts.paramsSerializer = params => {
		Object.keys(params).forEach(key => params[key] === null && delete params[key]);
		return qs.stringify(params, {arrayFormat: 'comma'});
	};

	return axios(opts)
		.then(res => {
			return res.data;
		})
		.catch(res => {
			let err = {};
			let response = res.response;
			if (response?.data?.error) {
				err.error =
					Array.isArray(response.data.message) &&
					response.data.message[0]?.messages[0]?.message
						? response.data.message[0]?.messages[0]?.message
						: typeof response.data.message === 'string'
						? response.data.message
						: response.data.error;
			} else if (response) {
				err.error = response.statusText;
				err.status = response.status;
			} else {
				err.error = res.message || 'HTTP Error';
				err.status = 0;
			}
			return err;
		});
};

export const get = (url, params) => request({url, params});

export const post = (url, params, data) => request({method: 'post', url, params, data});

export const put = (url, params, data) => request({method: 'put', url, params, data});

export const del = (url, params, data) => request({method: 'delete', url, params, data});

export const head = (url, params) => request({method: 'head', url, params});
