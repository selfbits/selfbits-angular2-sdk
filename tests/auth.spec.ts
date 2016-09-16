import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule, ResponseOptions, Response, RequestMethod} from "@angular/http";
import {TESTHEADERS, TESTURL, TESTCONFIG, TESTAUTHSUCESSRES} from "./helpers";

import * as utils from '../src/utils/utils'
import {SelfbitsAuth} from "../src/services/auth";
import {SelfbitsAuthConfig} from "../src/utils/interfaces";
import {SELFBITS_CONFIG} from "../src/utils/tokens";

describe('auth.ts',()=> {

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
				SelfbitsAuth
			],
			imports: [
				HttpModule
			]
		})

	});


	it('should load with config data injected',inject([SelfbitsAuth],(auth:any)=>{
		expect(auth.config).toEqual(TESTCONFIG);
		expect(auth.headers).toEqual(TESTHEADERS);
		expect(auth.baseUrl).toEqual(TESTURL);

	}));

	it('checkForToken() should append Authorization header ', inject([SelfbitsAuth],(auth:any)=>{

		window.localStorage.setItem('token','httpTestToken');

		expect(auth.headers.has('Authorization')).toBeFalsy();
		auth.checkForToken();
		expect(auth.headers.get('Authorization')).toEqual('Bearer httpTestToken')
	}));

	it('logout() should remove token, userId and expires',inject([SelfbitsAuth],(auth:SelfbitsAuth)=>{
		window.localStorage.setItem('token', 'authTesttoken');
		window.localStorage.setItem('userId', 'authTestUserId');
		window.localStorage.setItem('expires', 'authTestExpiration');

		auth.logout();

		expect(window.localStorage.hasOwnProperty('token')).toBeFalsy();
		expect(window.localStorage.hasOwnProperty('userId')).toBeFalsy();
		expect(window.localStorage.hasOwnProperty('expires')).toBeFalsy();
	}));


	it('getUserId() should getuserId',inject ([SelfbitsAuth],(auth:SelfbitsAuth)=>{
		window.localStorage.setItem('userId', 'authTestUserId');
		expect(auth.getUserId()).toEqual('authTestUserId');
	}));

	it('isAuthenticated() should return check user state',inject ([SelfbitsAuth],(auth:SelfbitsAuth)=>{
		window.localStorage.setItem('token', 'authTesttoken');
		expect(auth.isAuthenticated()).toBeTruthy();
		window.localStorage.removeItem('token');
		expect(auth.isAuthenticated()).toBeFalsy();
	}))


	describe('check methodes', ()=>{

		let auth:SelfbitsAuth;
		let backend:MockBackend;
		let checkTokenSpy:any;
		let response:any;
		let user: SelfbitsAuthConfig = {
			email: 'test@email.io',
			password: 'test'
		};

		beforeEach(inject([SelfbitsAuth,MockBackend],(testAuth:SelfbitsAuth, testBackend:MockBackend)=>{

			auth = testAuth;
			backend = testBackend;
			checkTokenSpy = spyOn(testAuth,'checkForToken');

		}));

		afterEach(()=>{
			auth = null;
			backend = null;
			response = null;

			window.localStorage.removeItem('token');
			window.localStorage.removeItem('userId');
			window.localStorage.removeItem('expires');
		});

		it('should inject header correctly', fakeAsync(()=>{
			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.headers.get('sb-app-id')).toEqual('fancyId');
				expect(connection.request.headers.get('sb-app-secret')).toEqual('fancySecret');
				expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
			});

			auth.login(user);
			auth.signup(user);
			auth.unlink('selfbits');
			auth.changePassword('newPassword','oldPassword');
		}));

		it('login() should work and set token', fakeAsync(() => {

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);
				expect(connection.request.getBody()).toEqual(JSON.stringify(user));

				let response = new ResponseOptions({body:JSON.stringify(TESTAUTHSUCESSRES)});

				connection.mockRespond(new Response(response));

			});

			auth.login(user).subscribe(res => {
				response = res;
			});

			tick();

			expect(window.localStorage.getItem('token')).toEqual('fancyToken');
			expect(window.localStorage.getItem('userId')).toEqual('fancyUserId');
			expect(window.localStorage.getItem('expires')).toEqual('fancyExpiration');

		}));

		it('signup() should work and set token', fakeAsync(() => {

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);
				expect(connection.request.getBody()).toEqual(JSON.stringify(user));

				let response = new ResponseOptions({body:JSON.stringify(TESTAUTHSUCESSRES)});

				connection.mockRespond(new Response(response));

			});

			auth.signup(user).subscribe(res => {
				response = res;
			});

			tick();

			expect(window.localStorage.getItem('token')).toEqual('fancyToken');
			expect(window.localStorage.getItem('userId')).toEqual('fancyUserId');
			expect(window.localStorage.getItem('expires')).toEqual('fancyExpiration');

		}));

		it('signupAnonymous() should login user and return token', fakeAsync(()=>{

			backend.connections.subscribe((connection:MockConnection)=>{
				expect(connection.request.method).toBe(RequestMethod.Post);

				let response = new ResponseOptions({body:JSON.stringify(TESTAUTHSUCESSRES)});

				connection.mockRespond(new Response(response));
			});

			auth.signupAnonymous().subscribe(res => {
				response = res.json()
			});

			tick();

			expect(window.localStorage.getItem('token')).toEqual('fancyToken');
			expect(window.localStorage.getItem('userId')).toEqual('fancyUserId');
			expect(window.localStorage.getItem('expires')).toEqual('fancyExpiration');
		}));

		it('changePassword() should change password if user is logged and token exists',  fakeAsync(() => {

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);
				expect(connection.request.getBody()).toEqual(JSON.stringify(changePassword));

				let mockResponseBody = { data: 'authTestData' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));

			});

			let changePassword = {
				newPassword: 'newPassword',
				oldPassword: 'oldPassword'
			};

			auth.changePassword(changePassword.newPassword, changePassword.oldPassword).subscribe(res => {
				response = res.json();
			});

			tick();

			expect(response.data).toEqual('authTestData');
			expect(checkTokenSpy).toHaveBeenCalled();

		}));

		it('social() should allow user to login with social provider and set token', fakeAsync(() => {

			let guidSpy = sinon.spy(utils, 'sbGuid');

			let windowStub = sinon.stub(window,'open',(url:string)=>{
				let genGuild = guidSpy.getCall(0).returnValue + guidSpy.getCall(1).returnValue;
				let popupUrl = `${TESTCONFIG.BASE_URL}/api/v1/oauth/facebook?sb_app_id=${TESTCONFIG.APP_ID}&sb_app_secret=${TESTCONFIG.APP_SECTRET}&state=${genGuild}`;

				expect(url).toEqual(popupUrl);
				backend.connections.subscribe( (connection:MockConnection)=>{
					expect(connection.request.method).toBe(RequestMethod.Get);
					expect(connection.request.headers.get('sb-app-id')).toEqual('fancyId');
					expect(connection.request.headers.get('sb-app-secret')).toEqual('fancySecret');
					expect(connection.request.headers.get('Content-Type')).toEqual('application/json');

					let getTokenUrl = `${TESTCONFIG.BASE_URL}/api/v1/oauth/facebook/token?state=${genGuild}`;
					expect(connection.request.url).toEqual(getTokenUrl);

					let response = new ResponseOptions({body:JSON.stringify(TESTAUTHSUCESSRES)});

					connection.mockRespond(new Response(response));
				});
				return {closed: true}
			});

			auth.social('facebook').subscribe(res => {
			});

			tick(1000);

			expect(window.localStorage.getItem('token')).toEqual('fancyToken');
			expect(window.localStorage.getItem('userId')).toEqual('fancyUserId');
			expect(window.localStorage.getItem('expires')).toEqual('fancyExpiration');

		}));



	})
});
