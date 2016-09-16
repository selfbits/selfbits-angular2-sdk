import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { QueryParams, GetParams } from '../utils/interfaces';

import * as utils from '../utils/utils'

export class SbHttp{

	private baseUrl:string;

	constructor( private url:string, private headers:Headers, private http:Http
	){
		this.baseUrl = utils.stripTrailingSlash(this.url)
	}

	public post(data:any):Observable<any>{
		this.checkForToken();
		return this.http.post(this.baseUrl, JSON.stringify(data),{headers: this.headers})
			.catch(this.errorHandler)
	}

	//ToDo: public postBulk(data:any){}
	/* to create a bulk of new objects, not necessary at the moment*/

	public get(getParams:GetParams):Observable<any>{
		this.checkForToken();
		return this.http.get(utils.getParamsUrlHelper(this.baseUrl,getParams),{headers: this.headers})
			.catch(this.errorHandler)
	}

	public query(queryParams?:QueryParams){
		this.checkForToken();
		return this.http.get(utils.queryParamsUrlHelper(this.baseUrl,queryParams),{headers: this.headers})
			.catch(this.errorHandler)
	}

	public put(data:any, id:string):Observable<any>{
		this.checkForToken();
		return this.http.put(utils.urlHelper(this.baseUrl,id), JSON.stringify(data),{headers: this.headers})
			.catch(this.errorHandler)
	}

	public delete(id:string):Observable<any>{
		this.checkForToken();
		return this.http.delete(utils.urlHelper(this.baseUrl,id), {headers: this.headers})
			.catch(this.errorHandler)
	}

	private checkForToken(){
		if (window.localStorage.hasOwnProperty('token')){
			this.headers.set('Authorization','Bearer '+ window.localStorage.getItem('token'))
		}
	}

	private errorHandler(error:any){
		return Observable.throw(error.json())
	}

}
