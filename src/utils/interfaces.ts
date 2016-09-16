export interface SelfbitsAppConfig {
	BASE_URL: string,
	APP_ID: string,
	APP_SECTRET: string
}

export interface SelfbitsAuthConfig {
	email: string,
	password: string
}

export interface SbAuthSucessResponse {
	token:string,
	userId:string,
	expires:string
}

export interface ExistingFile {
	fileId: string, 					/* ID of the uploaded file, */
	expiresInSeconds?: number /* Define the time to live of the temporary download link */
}

export interface UploadFile {
	file: any, 					/* The file you want to upload, */
	fileName?: string,
	filePath?: string,				/* The destination path where you want to put the file. Default is the file name. */
	permissionScope?: string /* 'user' = only the uploading user can access the file. '*': Every authenticated user can access the file if he has its fileId. */
}

export interface QueryParams {
	pageSize?: number,
	pageNumber?: number,
	filter?: string,
	sort?: string,
	deep?: boolean,
	meta?: boolean
}

export interface GetParams {
	id: any,
	deep?: boolean,
	meta?: boolean
}
