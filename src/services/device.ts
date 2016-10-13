import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs';

import { SelfbitsAppConfig } from '../utils/interfaces';
import * as utils from '../utils/utils'
import {SELFBITS_CONFIG} from "../utils/tokens";

declare var window:any;

@Injectable()

export class SelfbitsDevice{
	private baseUrl:string;
	private headers :Headers;
	private devicePath= 'api/v1/user/device';

	constructor(@Inject(SELFBITS_CONFIG) private config: SelfbitsAppConfig, private http:Http){
		this.baseUrl = utils.stripTrailingSlash(this.config.BASE_URL);
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id',this.config.APP_ID);
		this.headers.append('sb-app-secret',this.config.APP_SECRET);
	}

	public sync():Observable<any>{
		if(window.cordova && window.device){
			this.checkForToken();
			return this.http.post(utils.urlHelper(this.baseUrl,this.devicePath),window.device,{headers:this.headers})
		} else{
			return Observable.empty()
		}
	}

	private checkForToken() {
		if (window.localStorage.hasOwnProperty('token')) {
			this.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem('token'))
		}
	}

}
