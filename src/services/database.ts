import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { SbHttp } from './http';

import { SelfbitsAppConfig } from '../utils/interfaces';
import * as utils from '../utils/utils'



@Injectable()

export class SelfbitsDatabase {

	private dbBaseUrl: string;
	private headers: Headers;
	private dbPath = '/api/v1/db/m';

	constructor( @Inject('SelfbitsConfig') private config: SelfbitsAppConfig, private http:Http) {
		this.dbBaseUrl = `${utils.stripTrailingSlash(config.BASE_URL)}${this.dbPath}`;
		this.headers = new Headers();
		this.headers.append('Content-Type', 'application/json');
		this.headers.append('sb-app-id',this.config.APP_ID || '');
		this.headers.append('sb-app-secret',this.config.APP_SECTRET || '');
	}

	public databaseSchema(schemaId: string):SbHttp{
		return new SbHttp(utils.urlHelper(this.dbBaseUrl, schemaId),this.headers,this.http)

	}
}
