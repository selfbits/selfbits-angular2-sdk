import {TestBed, fakeAsync, inject, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {BaseRequestOptions, Http, HttpModule, RequestMethod, ResponseOptions, Response, Headers} from "@angular/http";
import {TESTCONFIG, TESTURL, mockUploadFile, mockExistingFile, mockUser, mockRole} from "./helpers";
import {SelfbitsFile} from "../src/services/file";
import {SELFBITS_CONFIG} from "../src/utils/tokens";


describe('file.ts',()=> {

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
				SelfbitsFile
			],
			imports: [
				HttpModule
			]
		})

	});

	afterEach(()=>{
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('userId');
		window.localStorage.removeItem('expires');
	});

	it('should load with config data injected',inject([SelfbitsFile],(file:any)=>{
		expect(file.config).toEqual(TESTCONFIG);
		expect(file.headers.get('sb-app-id')).toEqual('fancyId');
		expect(file.headers.get('sb-app-secret')).toEqual('fancySecret');
		expect(file.headers.get('Content-Type')).toEqual('application/json');
		expect(file.baseUrl).toEqual(TESTURL);
	}));

	it('checkForToken() should append Authorization header ', inject([SelfbitsFile],(file:any)=>{

		window.localStorage.setItem('token','httpTestToken');
		expect(file.headers.has('Authorization')).toBeFalsy();
		file.checkForToken();
		expect(file.headers.get('Authorization')).toEqual('Bearer httpTestToken');
	}));

	describe('file http methods', ()=>{

		let file:SelfbitsFile;
		let backend:MockBackend;
		let checkTokenSpy:any;
		let response:any;
		beforeEach(inject([SelfbitsFile,MockBackend],(testFile:SelfbitsFile,testBackend:MockBackend)=>{
			file = testFile;
			backend = testBackend;
			checkTokenSpy = spyOn(testFile,'checkForToken');
		}));

		afterEach(()=>{
			file = null;
			backend = null;
			checkTokenSpy = null;
			response = null;
		});

		it('should have a working getAll()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Get);
				expect(connection.request.url).toBe(`${TESTURL}/api/v1/file`);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.getAll().subscribe(res => {
				response = res.json();

			});

			expect(checkTokenSpy).toHaveBeenCalled();
			expect(response.content).toBe('Testing');

		}));

		it('should have a working upload()',fakeAsync(()=>{

			let mockInitialUploadResponse = { responseName:"initiateUpload", putFileUrl: 'amazonPutUrl', fileId: 'd411ac6'};
			let mockExecuteUploadResponse = { responseName:"executeUpload", putFileUrl: 'executeUploadUploadResponse'};
			let mockVerifyUploadResponse = { responseName:"verifyUpload"};

			backend.connections.subscribe((connection: MockConnection) => {

				/* Testing initiateUpload */
				if(connection.request['url']=="fancyUrl/api/v1/file"){
					expect(connection.request.method).toBe(RequestMethod.Post);
					expect(connection.request.getBody()).toBe(
						JSON.stringify({"filePath":"the/File/Path","permissionScope":"user"})
					);

					let response = new ResponseOptions({ body: JSON.stringify(mockInitialUploadResponse) });
					connection.mockRespond(new Response(response));
				}

				/* Testing executeUpload*/
				else if(connection.request['url'] === "amazonPutUrl"){
					expect(connection.request.method).toBe(RequestMethod.Put);
					expect(connection.request.getBody()).toBe(JSON.stringify("contentOfTheFile"));

					let amazonMockHeader = new Headers();
					amazonMockHeader.append('ETag', 'theMockETag');
					let response = new ResponseOptions({
						body: JSON.stringify(mockExecuteUploadResponse),
						headers: amazonMockHeader
					});
					connection.mockRespond(new Response(response));
				}

				/* Testing verifyUpload */
				else if(connection.request['url'] === "fancyUrl/api/v1/file/d411ac6/verify"){

					expect(connection.request.method).toBe(RequestMethod.Post);
					expect(connection.request.getBody()).toBe(JSON.stringify({"etag":"theMockETag"}));

					let response = new ResponseOptions({ body: JSON.stringify(mockVerifyUploadResponse) });

					connection.mockRespond(new Response(response));
				}

			});


			file.upload(mockUploadFile).subscribe(res => {
				expect(res.json().responseName).toBe("verifyUpload");
			});

			tick();
			expect(checkTokenSpy).toHaveBeenCalled()

		}));

		it('should have a working get()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Get);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId
					+'?expiresInSeconds='+mockExistingFile.expiresInSeconds;
				expect(connection.request.url).toBe(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.get(mockExistingFile).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled()

		}));



		it('should have a working deleteById()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Delete);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId;
				expect(connection.request.url).toBe(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.deleteById(mockExistingFile.fileId).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled();

		}));




		it('should have a working giveUserPermissionToReadFile()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId
					+'/acl/user/' + mockUser.userId;
				expect(connection.request.url).toBe(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.giveUserPermissionToReadFile(mockExistingFile.fileId,mockUser.userId).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled()
		}));



		it('should have a working deleteUserPermissionToReadFile()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Delete);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId
					+'/acl/user/' + mockUser.userId;
				expect(connection.request.url).toBe(requestPath);

				console.log(connection.request.url);
				console.log(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.deleteUserPermissionToReadFile(mockExistingFile.fileId,mockUser.userId).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled();

		}));



		it('should have a working giveRolePermissionToReadFile()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Post);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId
					+'/acl/user/' + mockRole.name;
				expect(connection.request.url).toBe(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.giveRolePermissionToReadFile(mockExistingFile.fileId,mockRole.name).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled()
		}));



		it('should have a working deleteRolePermissionToReadFile()',fakeAsync(()=>{

			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.method).toBe(RequestMethod.Delete);

				let requestPath = `${TESTURL}/api/v1/file/`+mockExistingFile.fileId
					+'/acl/user/' + mockRole.name;
				expect(connection.request.url).toBe(requestPath);

				console.log(connection.request.url);
				console.log(requestPath);

				let mockResponseBody = { content: 'Testing' };
				let response = new ResponseOptions({ body: JSON.stringify(mockResponseBody) });

				connection.mockRespond(new Response(response));
			});

			file.deleteRolePermissionToReadFile(mockExistingFile.fileId,mockRole.name).subscribe(res => {
				response = res.json();

			});

			tick();
			expect(response.content).toBe('Testing');
			expect(checkTokenSpy).toHaveBeenCalled();

		}));




	})





})
