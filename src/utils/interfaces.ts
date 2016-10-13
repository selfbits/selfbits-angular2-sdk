import {Observable} from "rxjs";
import {Response} from "@angular/http";

export interface SelfbitsAppConfig {
	BASE_URL: string,
	APP_ID: string,
	APP_SECRET?: string
}

export interface SelfbitsAuthConfig {
	email: string,
	password: string
}

export interface SelfbitsHttp{
	get(getParams:SbGetParams):Observable<Response>,
	query(queryParams?:SbQueryParams):Observable<Response>,
	post(data:any):Observable<Response>,
	put(data:any, id:string):Observable<Response>,
	delete(id:string):Observable<Response>
}

export interface SbAuthSucessResponse {
	token:string,
	userId:string,
	expires:string
}

export interface SbExistingFile {
	fileId: string, 					/* ID of the uploaded file, */
	expiresInSeconds?: number /* Define the time to live of the temporary download link */
}

export interface SbUploadFile {
	file: any, 					/* The file you want to upload, */
	fileName?: string,
	filePath?: string,				/* The destination path where you want to put the file. Default is the file name. */
	permissionScope?: string /* 'user' = only the uploading user can access the file. '*': Every authenticated user can access the file if he has its fileId. */
}

export interface SbQueryParams {
	pageSize?: number,
	pageNumber?: number,
	filter?: string,
	sort?: string,
	deep?: boolean,
	meta?: boolean
}

export interface SbGetParams {
	id: any,
	deep?: boolean,
	meta?: boolean
}

