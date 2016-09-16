
import {QueryParams, GetParams} from './interfaces';

export function stripTrailingSlash(value: string): string {
	// Is the last char a /
	if (value.substring(value.length - 1, value.length) === '/') {
		return value.substring(0, value.length - 1);
	} else {
		return value;
	}
}

//private helpers
export function urlHelper(baseUrl: string, params?: string): string {
	return params ? `${baseUrl}/${params}` : `${baseUrl}`
}

export function setLocalStorage(key: string, value: string) {
	window.localStorage.setItem(key, value);
}

export function queryParamsUrlHelper(
	baseUrl: string,
	params?: QueryParams): string {

	if (!params) { return `${baseUrl}`; }
	let url: string = baseUrl;
	let paramList: string[] = [];


	if (params.pageSize &&
		typeof params.pageSize === 'number'
	) {
		if(params.pageSize > 100) params.pageSize = 100;
		paramList.push("pageSize=" + params.pageSize);
	}

	if (params.pageNumber &&
		typeof params.pageNumber === 'number'
	) {
		paramList.push("pageNumber=" + params.pageNumber);
	}

	if (params.filter &&
		typeof params.filter === 'string'
	) { paramList.push("filter=" + params.filter); }

	if (params.sort &&
		typeof params.sort === 'string' &&
		(params.sort == "ASC" || params.sort == "DESC")
	) {
		paramList.push("sort=" + params.sort);
	}

	if (params.deep &&
		typeof params.deep === 'boolean'
	) { paramList.push("deep=" + params.deep); }

	if (params.meta &&
		typeof params.meta === 'boolean'
	) { paramList.push("meta=" + params.meta); }

	url = paramList.length == 0 ? `${url}` : `${url}?${paramList.join('&')}`;

	return `${url}`;
}

export function getParamsUrlHelper(
	baseUrl: string,
	params?: GetParams): string {


	let url = `${baseUrl}/${params.id}`;

	if (!params.deep && !params.meta) { return `${url}` }
	let paramList: string[] = [];

	if (params.deep &&
		typeof params.deep === 'boolean'
	) { paramList.push("deep=" + params.deep); }

	if (params.meta &&
		typeof params.meta === 'boolean'
	) { paramList.push("meta=" + params.meta); }


	url = paramList.length == 0 ? `${url}` : `${url}?${paramList.join('&')}`;

	return `${url}`;
}


export function  sbGuid(){
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}


