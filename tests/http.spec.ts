import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule, ResponseOptions, Response, RequestMethod} from "@angular/http";
import {TESTHEADERS, TESTURL} from "./helpers";

import * as utils from '../src/utils/utils'
import {SbHttp} from "../src/services/http";

describe('http.ts',()=>{

	beforeEach(()=>{
		TestBed.configureTestingModule({
			providers:[
				MockBackend,
				BaseRequestOptions,
				{ provide: Http, useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
					return new Http(backend, defaultOptions);
				}, deps: [MockBackend, BaseRequestOptions]}
			],
			imports: [
				HttpModule
			]
		})

	});

	afterEach(()=>{
		TestBed.resetTestingModule()

	});


	it('checkForToken() should append Authorization header ', inject([Http],(testHttp:Http)=>{
		let http:any = new SbHttp(TESTURL,TESTHEADERS,testHttp);

		window.localStorage.setItem('token','httpTestToken');

		expect(http.headers.has('Authorization')).toBeFalsy();
		http.checkForToken();
		expect(http.headers.get('Authorization')).toEqual('Bearer httpTestToken')
	}));


	describe('check cruds', ()=>{

		let http:SbHttp;
		let backend:MockBackend;
		let tokenSpy:any;
		let response:any;


		beforeEach(inject([Http,MockBackend],fakeAsync((testHttp:Http, testBackend:MockBackend)=>{
			http = new SbHttp(TESTURL,TESTHEADERS,testHttp);
			backend = testBackend;
			tokenSpy = spyOn(http, 'checkForToken');
		})));

		afterEach(()=>{
			http = null;
			backend = null;
			response= null;
		});

		it('query() should work', fakeAsync(()=>{

			let queryParamsSpy = spyOn(utils,'queryParamsUrlHelper');

			backend.connections.subscribe((connection:MockConnection)=>{

				expect(connection.request.method).toEqual(RequestMethod.Get);
				expect(connection.request.headers).toEqual(TESTHEADERS);

				let mockResponseBody = { data:'httpTestData'};
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));

			});

			http.query().subscribe(res =>{
				response = res.json();
			});

			tick();

			expect(response.data).toEqual('httpTestData');
			expect(queryParamsSpy).toHaveBeenCalled();
			expect(tokenSpy).toHaveBeenCalled()
		}));

		it('get() should work', fakeAsync(()=>{

			let getParamsSpy = spyOn(utils,'getParamsUrlHelper');

			backend.connections.subscribe((connection:MockConnection)=>{
				expect(connection.request.method).toEqual(RequestMethod.Get);
				expect(connection.request.headers).toEqual(TESTHEADERS);

				let mockResponseBody = { data:'httpTestData'};
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			http.get({id:'test'}).subscribe(res =>{
				response = res.json();
			});

			tick();

			expect(response.data).toEqual('httpTestData');
			expect(getParamsSpy).toHaveBeenCalled();
			expect(tokenSpy).toHaveBeenCalled()
		}));

		it('post() should work', fakeAsync(()=> {


			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);
				expect(connection.request.headers).toEqual(TESTHEADERS);

				expect(connection.request.getBody()).toEqual(JSON.stringify({
					key: 'Value',
					bol: true
				}));


				let mockResponseBody = { data:'httpTestData'};
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			let data = {
				key: 'Value',
				bol: true
			};

			http.post(data).subscribe(res => {
				response = res.json();
			});

			expect(response.data).toEqual('httpTestData');
			expect(tokenSpy).toHaveBeenCalled();
		}));

		it('put() should work', fakeAsync(()=> {

			let urlSpy = spyOn(utils,'urlHelper');

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Put);
				expect(connection.request.headers).toEqual(TESTHEADERS);

				expect(connection.request.getBody()).toEqual(JSON.stringify({
					key: 'Value',
					bol: true
				}));

				let mockResponseBody = { data:'httpTestData'};
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			let data = {
				key: 'Value',
				bol: true
			};

			let id = 'testingID';

			http.put(data, id).subscribe(res => {
				response = res.json();
			});

			tick();

			expect(response.data).toEqual('httpTestData');
			expect(tokenSpy).toHaveBeenCalled();
			expect(urlSpy).toHaveBeenCalled();
		}));

		it('delete() should work', fakeAsync(() => {

			let urlSpy = spyOn(utils,'urlHelper');

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Delete);
				expect(connection.request.headers).toEqual(TESTHEADERS);

				let mockResponseBody = { data:'httpTestData'};
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			let id = 'testingID';

			http.delete(id).subscribe(res => {
				response = res.json();
			});

			tick();

			expect(response.data).toEqual('httpTestData');
			expect(tokenSpy).toHaveBeenCalled();
			expect(urlSpy).toHaveBeenCalled();
		}));
	})
});
