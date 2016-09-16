import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule} from "@angular/http";
import { TESTURL, TESTCONFIG} from "./helpers";

import {SelfbitsPush} from "../src/services/push";

declare var window:any;

describe('push.ts',()=>{

	beforeEach(()=>{
		TestBed.configureTestingModule({
			providers:[
				MockBackend,
				BaseRequestOptions,
				{ provide: Http, useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
					return new Http(backend, defaultOptions);
				}, deps: [MockBackend, BaseRequestOptions]},
				{ provide: 'SelfbitsConfig', useValue:TESTCONFIG},
				SelfbitsPush
			],
			imports: [
				HttpModule
			]
		});


		window.PushNotification = {
			init: function(args:any) {
				return {
					on: function(data:any){return data}
				};
			}
		};

		window.device = {
			uuid: 123456
		}

	});

	it('should load with config data injected',inject([SelfbitsPush],(push:any)=>{
		expect(push.config).toEqual(TESTCONFIG);
		expect(push.headers.get('sb-app-id')).toEqual('fancyId');
		expect(push.headers.get('sb-app-secret')).toEqual('fancySecret');
		expect(push.headers.get('Content-Type')).toEqual('application/json');
		expect(push.baseUrl).toEqual(TESTURL);
	}));

	describe('push methods without http', ()=>{
		let sbPush:any;

		beforeEach(inject([SelfbitsPush], (testPush:SelfbitsPush)=>{
			sbPush = testPush;
		}));

		it('init() should initate push',()=>{

			sbPush.init({}).subscribe();
			let push = sbPush.getPush();
			expect(typeof push.on).toEqual('function');

		});

		it('sync() should console error if push ins not initialized',()=>{
			spyOn(console, 'error');
			let testPush = sbPush.sync().subscribe();

			expect(console.error).toHaveBeenCalledWith('Push is not initialized!');

			testPush.unsubscribe();
		});

		it('sync() should console error if no registration data received',()=>{
			spyOn(console, 'error');
			sbPush.push = {test:'test'};
			let testPush = sbPush.sync().subscribe();

			expect(console.error).toHaveBeenCalledWith('Did not receive push registration data!');
			testPush.unsubscribe();
		});

		it('getPush() should return push object if not null',()=>{
			spyOn(console, 'error');
			let testPush = sbPush.getPush();
			expect (testPush).toBeUndefined();
			expect(console.error).toHaveBeenCalled();

			sbPush.init({}).subscribe();

			testPush = sbPush.getPush();
			expect(testPush).toBeDefined();
			expect(typeof testPush.on ).toEqual('function')
		});

		it('bindCordovaCallback() should wrap callbacks in an Observable',() =>{

			let fnSuccess = function (successHandler:any, errorHandler:any, options:any) {
				expect(options).toEqual({test:'test'});
				let success = successHandler;
				success('success');
			};

			let fn$ = sbPush.bindCordovaCallback(fnSuccess,{test:'test'}).subscribe(
				(res:any) => {
					expect(res).toEqual('success')
				}
			);

			fn$.unsubscribe();

			let fnError = function (successHandler:any, errorHandler:any, options:any) {
				expect(options).toEqual({test:'test'});
				let error = errorHandler;
				error('error')
			};

			sbPush.bindCordovaCallback(fnError,{test:'test'}).subscribe(()=>{},
				(err:any) => {
					expect(err).toEqual('error')
				}
			)
		});


	});

	it('checkForToken() should append Authorization header ', inject([SelfbitsPush],(push:any)=>{

		window.localStorage.setItem('token','httpTestToken');
		expect(push.headers.has('Authorization')).toBeFalsy();
		push.checkForToken();
		expect(push.headers.get('Authorization')).toEqual('Bearer httpTestToken')
		window.localStorage.removeItem('token');
	}));

	it('sync() should transmit push data to backend',inject([SelfbitsPush, MockBackend],fakeAsync((sbPush:any, backend:MockBackend)=>{

		let checkTokenSpy = spyOn(sbPush,'checkForToken');

		backend.connections.subscribe((connection:MockConnection)=>{
			expect(connection.request.url).toEqual(`${TESTURL}/api/v1/user/device/notification`);
			expect(connection.request.getBody()).toEqual(JSON.stringify({uuid:123456,deviceToken:'testRegistrationData'}))
		});

		sbPush.pushRegistrationData = {
			registrationId:'testRegistrationData'
		};

		sbPush.init({}).subscribe();
		sbPush.sync().subscribe();

		tick();

		expect(checkTokenSpy).toHaveBeenCalled()
	})));
});
