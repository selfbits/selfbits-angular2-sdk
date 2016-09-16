import { Injectable, Inject } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';
import { Observable, Subject } from 'rxjs';

import * as utils from '../utils/utils'
import { SelfbitsAppConfig, SelfbitsAuthConfig } from '../utils/interfaces';

declare var window:any;

@Injectable()

export class SelfbitsAuth{

	private baseUrl:string;
	private headers :Headers;
	private loginPath= 'api/v1/auth/login';
	private signupPath= 'api/v1/auth/signup';
	private signupAnonymousPath = '/api/v1/auth/signup/anonymous';
	private changePasswordPath = 'api/v1/auth/password';
	private socialPath= 'api/v1/oauth';
	private interval = Observable.interval(500);

	constructor(@Inject('SelfbitsConfig') private config:SelfbitsAppConfig, private http:Http){
		this.baseUrl = utils.stripTrailingSlash(this.config.BASE_URL);
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id',this.config.APP_ID);
		this.headers.append('sb-app-secret',this.config.APP_SECTRET);

	}

	public login(login:SelfbitsAuthConfig):Observable<Response>{
		return this.http.post(utils.urlHelper(this.baseUrl,this.loginPath), JSON.stringify(login),{headers: this.headers})
			.map( res => {
				utils.setLocalStorage('token',res.json()['token']);
				utils.setLocalStorage('userId',res.json()['userId']);
				utils.setLocalStorage('expires',res.json()['expires']);
				return res
		})
	}

	public signup(signup:SelfbitsAuthConfig):Observable<Response>{
		return this.http.post(utils.urlHelper(this.baseUrl,this.signupPath), JSON.stringify(signup),{headers: this.headers})
			.map( res => {
				utils.setLocalStorage('token',res.json()['token']);
				utils.setLocalStorage('userId',res.json()['userId']);
				utils.setLocalStorage('expires',res.json()['expires']);
				return res
			});
	}

	public signupAnonymous(){
		return this.http.post(utils.urlHelper(this.baseUrl,this.signupAnonymousPath),null,{headers: this.headers})
			.map( res => {
				utils.setLocalStorage('token',res.json()['token']);
				utils.setLocalStorage('userId',res.json()['userId']);
				utils.setLocalStorage('expires',res.json()['expires']);
				return res
			});
	}

	public changePassword(newPassword:string, oldPassword:string){
		this.checkForToken();
		return this.http.post(`${this.baseUrl}/${this.changePasswordPath}`, JSON.stringify({
				newPassword: newPassword,
				oldPassword: oldPassword
			}),
			{headers: this.headers})
	}

	public social(providerName:string):Subject<Response>{

		let uniqueState = utils.sbGuid() + utils.sbGuid();
		let popupUrl = `${this.baseUrl}/${this.socialPath}/${providerName}?sb_app_id=${this.config.APP_ID}&sb_app_secret=${this.config.APP_SECTRET}&state=${uniqueState}`;
		let authWindow:any;
		let response$ = new Subject<Response>();

		if(window.cordova){
			let authWindow = window.InAppBrowser.open(popupUrl, '_blank', 'location=yes');
			let isClosed:boolean;


			let pingWindow = this.interval.subscribe( res =>{
				if(isClosed === true){
					isClosed = null;
					pingWindow.unsubscribe();
					this.getSocialToken(providerName,uniqueState)
						.subscribe(res => response$.next(res))
				}
			});

			authWindow.addEventListener('loadstop', (event:any) => {
				if(event.url.indexOf(`${providerName}/callback`) > -1){
					authWindow.close()
				}
			});

			authWindow.addEventListener('loaderror', (event:any) =>{
				if(event.url.indexOf(`${providerName}/callback`) > -1){
					authWindow.close()
				}
			});

			authWindow.addEventListener('exit', () => {
				isClosed = true;
			});


		}else{
			authWindow = window.open(popupUrl, '_blank', 'height=700, width=500');

			let pingWindow = this.interval.subscribe(res =>{
				if(authWindow.closed){
					pingWindow.unsubscribe();
					this.getSocialToken(providerName,uniqueState)
						.subscribe(res => {
							response$.next(res)
						})
				}
			});
		}
		return response$
	}

	public unlink(providerName:string){
		this.checkForToken();
		return this.http.delete(`${this.baseUrl}/${this.socialPath}/${providerName}/unlink`,{headers: this.headers})
	}

	public logout(){
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('userId');
		window.localStorage.removeItem('expires');
	}

	public getUserId(){
		return window.localStorage.getItem('userId');
	}

	public isAuthenticated(){
		return window.localStorage.getItem('token') !== null
	}

	private getSocialToken(providerName:string, uniqueState:string):Observable<Response>{
		let getTokenUrl = `${this.baseUrl}/${this.socialPath}/${providerName}/token?state=${uniqueState}`;
		return this.http.get(getTokenUrl,{headers: this.headers}).map( res => {
			utils.setLocalStorage('token', res.json()['token']);
			utils.setLocalStorage('userId',res.json()['userId']);
			utils.setLocalStorage('expires',res.json()['expires']);
			return res
		});
	}

	private checkForToken(){
		if (window.localStorage.hasOwnProperty('token')){
			this.headers.set('Authorization','Bearer '+ window.localStorage.getItem('token'))
		}
	}
}


