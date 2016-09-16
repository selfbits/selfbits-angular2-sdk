import {TestBed, inject} from "@angular/core/testing";
import {HttpModule} from "@angular/http";

import {SelfbitsDatabase} from "../src/services/database";
import {TESTCONFIG, TESTHEADERS, TESTURL} from "./helpers";


describe('database.ts', ()=>{

	beforeEach(()=>{
		TestBed.configureTestingModule({
			providers:[
				SelfbitsDatabase,
				{ provide: 'SelfbitsConfig', useValue:TESTCONFIG}
			],
			imports:[HttpModule]
		})
	});

	it('should load with config data injected',inject([SelfbitsDatabase],(database:any)=>{

		expect(database.config).toEqual(TESTCONFIG);
		expect(database.headers).toEqual(TESTHEADERS);
		expect(database.dbBaseUrl).toEqual(`${TESTURL}/api/v1/db/m`);

	}));

	it('databaseSchema() should create new http instance', inject([SelfbitsDatabase],(database:SelfbitsDatabase)=>{

		let testDb = database.databaseSchema('test');

		expect(typeof testDb.post).toEqual('function');
		expect(typeof testDb.get).toEqual('function');
		expect(typeof testDb.query).toEqual('function');
		expect(typeof testDb.delete).toEqual('function');
		expect(typeof testDb.put).toEqual('function');

	}))

});
