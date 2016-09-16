import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule, ResponseOptions, Response, RequestMethod} from "@angular/http";
import {TESTHEADERS, TESTURL, TESTCONFIG} from "./helpers";

import {SelfbitsDevice} from "../src/services/device";

declare var window:any;

describe('device.ts',()=> {

	beforeEach(()=> {
		TestBed.configureTestingModule({
			providers: [
				MockBackend,
				BaseRequestOptions,
				{
					provide: Http, useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
					return new Http(backend, defaultOptions);
				}, deps: [MockBackend, BaseRequestOptions]
				},
				{ provide: 'SelfbitsConfig', useValue:TESTCONFIG},
				SelfbitsDevice
			],
			imports: [
				HttpModule
			]
		});

		window.cordova=true;
		window.device=true;

	});

	it('should load with config data injected',inject([SelfbitsDevice],(device:any)=>{
		expect(device.config).toEqual(TESTCONFIG);
		expect(device.headers).toEqual(TESTHEADERS);
		expect(device.baseUrl).toEqual(TESTURL);
	}));

	it('checkForToken() should append Authorization header ', inject([SelfbitsDevice],(device:any)=>{
		window.localStorage.setItem('token','httpTestToken');
		expect(device.headers.has('Authorization')).toBeFalsy();
		device.checkForToken();
		expect(device.headers.get('Authorization')).toEqual('Bearer httpTestToken');
		window.localStorage.removeItem('token');
	}));

	it('sync() should transmite user device data', inject([SelfbitsDevice, MockBackend], fakeAsync((device:SelfbitsDevice, backend:MockBackend)=>{
		let checkTokenSpy = spyOn(device, 'checkForToken');

		backend.connections.subscribe((connection:MockConnection)=>{

			expect(connection.request.method).toEqual(RequestMethod.Post);
			expect(connection.request.url).toEqual(`${TESTURL}/api/v1/user/device`);

			let response = new ResponseOptions({body:JSON.stringify({data:'deviceTestData'})});

			connection.mockRespond(new Response(response));


		});

		let response:any;

		device.sync().subscribe(res => {
			response = res.json();
		});

		tick();

		expect(response['data']).toEqual('deviceTestData');
		expect(checkTokenSpy).toHaveBeenCalled();

	})));
});
