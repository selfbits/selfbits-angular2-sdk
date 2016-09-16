import {TestBed, fakeAsync, inject, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule, RequestMethod, ResponseOptions, Response} from "@angular/http";
import {TESTCONFIG, TESTURL} from "./helpers";
import {SelfbitsUser} from "../src/services/user";
import {SELFBITS_CONFIG} from "../src/utils/tokens";


describe('user.ts',()=> {

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
				{ provide: SELFBITS_CONFIG, useValue:TESTCONFIG},
				SelfbitsUser
			],
			imports: [
				HttpModule
			]
		})

	});

	it('checkForToken() should append Authorization header ', inject([SelfbitsUser],(user:any)=>{

		window.localStorage.setItem('token','httpTestToken');
		expect(user.headers.has('Authorization')).toBeFalsy();
		user.checkForToken();
		expect(user.headers.get('Authorization')).toEqual('Bearer httpTestToken')
		window.localStorage.removeItem('token');
	}));

	it('should have a working current()',inject([SelfbitsUser, MockBackend],fakeAsync((user:SelfbitsUser, backend:MockBackend)=>{

		let checkTokenSpy = spyOn(user,'checkForToken');

		backend.connections.subscribe((connection: MockConnection) => {
			expect(connection.request.method).toBe(RequestMethod.Get);
			expect(connection.request.url).toBe(`${TESTURL}/api/v1/user`);

			let mockResponseBody = { data: 'userTestData' };
			let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

			connection.mockRespond(new Response(response));

		});
		let response:any;
		user.current().subscribe((res:any) => {
			response = res.json();
		});

		tick();

		expect(response.data).toBe('userTestData');
		expect(checkTokenSpy).toHaveBeenCalled();

	})));
})
