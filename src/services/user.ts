import { Injectable, Inject } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { Observable } from "rxjs";

import { SelfbitsAppConfig } from '../utils/interfaces';

import * as utils from '../utils/utils';

@Injectable()
export class SelfbitsUser {

	private baseUrl: string;
	private headers: Headers;
	private userPath = '/api/v1/user';

	constructor( @Inject('SelfbitsConfig') private config: SelfbitsAppConfig, private http: Http) {
		this.baseUrl = utils.stripTrailingSlash(this.config.BASE_URL);
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id', this.config.APP_ID);
		this.headers.append('sb-app-secret', this.config.APP_SECTRET);
	}

	public current(): Observable<any> {
		this.checkForToken();
		return this.http.get(this.baseUrl + this.userPath, { headers: this.headers })
			.catch(error => Observable.throw(error.json()));
	}

	private checkForToken() {
	 	if (window.localStorage.hasOwnProperty('token')) {
	 		this.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem('token'))
	 	}
	}

}
