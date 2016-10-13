import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { SelfbitsAppConfig } from '../utils/interfaces';

import * as utils from '../utils/utils'
import { Observable, Observer, Subject } from 'rxjs';
import {SELFBITS_CONFIG} from "../utils/tokens";

declare var window:any;

@Injectable()

export class SelfbitsPush{

	private push$ = new Subject<any>();

	private push:any;
	private baseUrl:string;
	private pushPath = 'api/v1/user/device/notification';
	private headers = new Headers;
	private pushRegistrationData:any;

	constructor(@Inject(SELFBITS_CONFIG) private config: SelfbitsAppConfig,private http:Http){
		this.baseUrl = utils.stripTrailingSlash(this.config.BASE_URL);
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id', this.config.APP_ID);
		this.headers.append('sb-app-secret', this.config.APP_SECRET);
	}

	public init(config:any):Observable<any>{
		if(window.PushNotification){
			return Observable.create((observer:Observer<any>)=>{
				this.push = window.PushNotification.init(config);
				this.push.on('registration', (data:any) => {
					this.pushRegistrationData = data;
					console.log('registered Push');
					observer.next(data);
					observer.complete();
				});
				this.push.on('notification', (data:any)=>{
					this.push$.next(data);
				});
				this.push.on('error', (err:any) =>{
					log.log(err);
					observer.error(err)
				});
			})
		} else{
			return Observable.empty()
		}
	}

	public sync():Observable<any>{
		if(!this.push){
			console.error('Push is not initialized!');
			return Observable.empty();
		}

		if(!this.pushRegistrationData){
			console.error('Did not receive push registration data!');
			return Observable.empty();
		}

		if(window.device && window.device.uuid && window.PushNotification &&
			this.pushRegistrationData && this.pushRegistrationData.registrationId){
			this.checkForToken();
			return this.http.post(utils.urlHelper(this.baseUrl,this.pushPath),JSON.stringify({
				uuid: window.device.uuid,
				deviceToken:this.pushRegistrationData.registrationId
			}),{headers:this.headers})
		} else{
			return Observable.empty();
		}
	}

	public unregister(options?:Array<any>):Observable<any>{
		return this.bindCordovaCallback(this.push.unregister,options || null)
	}

	public setBadgeNumber(number:number):Observable<any>{
		return this.bindCordovaCallback(this.push.setBadgeNumber,number)
	}

	public clearAllNotifications():Observable<any>{
		return this.bindCordovaCallback(this.push.clearAllNotifications)
	}

	public getPush(){
		if(this.push){
			return this.push
		}else{
			console.error('Push has not been initialized!')
		}
	}

	public getPush$():Subject<any>{
		return this.push$
	}

	private bindCordovaCallback(fn:any,args?:any):Observable<any>{
		return Observable.create((observer:Observer<any>)=>{

			let next = function (v:any){
				observer.next(v);
				observer.complete();
			};
			let err = (e:any) => observer.error(e);

			fn(next,err,args || null)
		})
	}

	private checkForToken() {
		if (window.localStorage.hasOwnProperty('token')) {
			this.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem('token'))
		}
	}

}
