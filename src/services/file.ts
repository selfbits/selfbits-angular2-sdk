import { Injectable, Inject } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';
import { Observable } from 'rxjs';

import { SelfbitsAppConfig, SbExistingFile, SbUploadFile } from '../utils/interfaces';
import * as utils from '../utils/utils'
import {SELFBITS_CONFIG} from "../utils/tokens";


@Injectable()
export class SelfbitsFile {

	private baseUrl: string;
	private headers: Headers;
	private filePath = '/api/v1/file';

	constructor( @Inject(SELFBITS_CONFIG) private config: SelfbitsAppConfig, private http: Http) {
		this.baseUrl = utils.stripTrailingSlash(config.BASE_URL);
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id', this.config.APP_ID);
		this.headers.append('sb-app-secret', this.config.APP_SECTRET);
	}

	public getAll(): Observable<any> {
		this.checkForToken();
		return this.http.get(this.baseUrl + this.filePath, { headers: this.headers })
			.catch(error => Observable.throw(error.json()))
	}

	/*
	 * ToDo: Test Missing: use for this the tests for initiateUpload, executeUpload, verifyUpload
	 */
	public upload(uploadFile: SbUploadFile): Observable<any> {
		let file: any = uploadFile.file;
		let initiateUploadResponse:any;
		return this.initiateUpload(uploadFile)
			.map((res: Response) => {
				initiateUploadResponse = res.json();
				return res
			})
			.flatMap(
				(amazonUploadResponse:any) => this.executeUpload(amazonUploadResponse.putFileUrl, JSON.stringify(file))
			)
			.flatMap(
			uploadResponse => this.verifyUpload(initiateUploadResponse.fileId, uploadResponse)
			)
	}


	private initiateUpload(uploadFile: SbUploadFile): Observable<any> {
		if (!uploadFile || !uploadFile.file) {
			throw new Error('Upload initialization failed! Missing file param!');
		} else {

			let file = uploadFile.file;
			let data = {
				'filePath': uploadFile.filePath || uploadFile.fileName,
				'permissionScope': uploadFile.permissionScope || 'user'
			};
			this.checkForToken();
			return this.http.post(this.baseUrl + this.filePath, JSON.stringify(data), { headers: this.headers })
		}
	}


	private executeUpload(amazonPutUrl: string, file: any): Observable<any> {
		let amazonRequestHeaders = new Headers({
			'Content-Type': file.type ? file.type : 'application/octet-stream',
			'Authorization': undefined,
			'SB-App-Id': undefined,
			'SB-App-Secret': undefined
		});
		return this.http.put(amazonPutUrl, file, amazonRequestHeaders);
	}

	private verifyUpload(fileId: String, uploadResponse:any): Observable<any> {
		let etag = uploadResponse.headers.get('ETag');
		if (!fileId) {
			throw new Error('Upload verification failed! Missing fileId!');
		} else if (!etag) {
			throw new Error('Upload verification failed! Missing etag!');
		} else {
			let options = { etag: etag };
			let postUrl = this.baseUrl + this.filePath + '/' + fileId + '/verify';
			return this.http.post(postUrl, options, { headers: this.headers });
		}
	}

	public get(existingFile: SbExistingFile): Observable<any> {
		this.checkForToken();
		if (!existingFile.fileId) {
			throw new Error('Missing fileId!');
		} else {
			let options = existingFile.expiresInSeconds ? '?expiresInSeconds=' + existingFile.expiresInSeconds : '?expiresInSeconds=900';
			return this.http.get(this.baseUrl + this.filePath + '/' + existingFile.fileId + options, { headers: this.headers })
				.catch(error => Observable.throw(error.json()));
		}
	}


	public deleteById(fileId:string): Observable<any> {
		this.checkForToken();
		if (!fileId) {
			throw new Error('Delete file failed! Missing fileId!');
		} else {
			return this.http.delete(this.baseUrl + this.filePath +'/' + fileId, { headers: this.headers });
		}
	}

	public giveUserPermissionToReadFile(fileId:string, userId:string): Observable<any> {
		this.checkForToken();
		if (!fileId || !userId) {
			throw new Error('giveUserPermissionToReadFile failed! Missing fileId or userId!');
		} else {
			return this.http.post(
				this.baseUrl + this.filePath +'/' + fileId+'/acl/user/' + userId,
				null,
				{ headers: this.headers }
			);
		}
	}

	public deleteUserPermissionToReadFile(fileId:string, userId:string): Observable<any> {
		this.checkForToken();
		if (!fileId || !userId) {
			throw new Error('deleteUserPermissionToReadFile failed! Missing fileId or userId!');
		} else {
			return this.http.delete(
				this.baseUrl + this.filePath +'/' + fileId + '/acl/user/' + userId, { headers: this.headers }
			);
		}


	}

	public giveRolePermissionToReadFile(fileId:string, roleId:string): Observable<any> {
		this.checkForToken();
		if (!fileId || !roleId) {
			throw new Error('giveRolePermissionToReadFile failed! Missing fileId or roleId!');
		} else {
			return this.http.post(
				this.baseUrl + this.filePath +'/' + fileId + '/acl/user/' + roleId,
				null,
				{ headers: this.headers }
			);
		}

	}

	public deleteRolePermissionToReadFile(fileId:string, roleId:string): Observable<any> {
		this.checkForToken();
		if (!fileId || !roleId) {
			throw new Error('deleteRolePermissionToReadFile failed! Missing fileId or roleId!');
		} else {
			return this.http.delete(
				this.baseUrl + this.filePath + '/' + fileId + '/acl/user/' + roleId, { headers: this.headers }
			);
		}
	}




	private checkForToken() {
		if (window.localStorage.hasOwnProperty('token')) {
			this.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem('token'))
		}
	}

}
