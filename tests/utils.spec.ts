import * as utils from '../src/utils/utils'


describe('Utility functions ', () => {

	it('should be able to trim trailing slash', () => {
		let testString = 'fancy/';
		let testString2 = 'fancy';
		expect(utils.stripTrailingSlash(testString)).toEqual(testString2);
		expect(utils.stripTrailingSlash(testString2)).toEqual(testString2);
	});

	it('should return complete Url', () => {
		let baseUrl = 'www.google.com';
		let param = 'id';

		expect(utils.urlHelper(baseUrl, param)).toEqual('www.google.com/id');
	});

	it('should set key,value to localstorage', () => {
		let key = 'utilTestKey';
		let value = 'utilTestValue';
		utils.setLocalStorage(key, value);
		expect(window.localStorage.hasOwnProperty('utilTestKey')).toBeTruthy();
		expect(window.localStorage.getItem('utilTestKey')).toEqual('utilTestValue');
		window.localStorage.removeItem(key);
		expect(window.localStorage.hasOwnProperty('utilTestKey')).toBeFalsy();
	});



	it("should return an extended Url", () => {
		let params = {
			pageSize: 3,
			sort: "DESC"
		};
		let baseUrl = "mockURL";

		let result = utils.queryParamsUrlHelper(baseUrl, params);

		expect(result).toBe('mockURL?pageSize=3&sort=DESC');

	});

	it("should return all Parameters", () => {
		let params = {
			pageSize: 1,
			pageNumber: 1,
			filter: "testString",
			sort: "ASC",
			deep: true,
			meta: true
		};
		let baseUrl = "mockURL";

		let result = utils.queryParamsUrlHelper(baseUrl, params);
		expect(result).toBe('mockURL?pageSize=1&pageNumber=1&filter=testString&sort=ASC&deep=true&meta=true');

	});



	it("should ignore 'sort'-Param that is no DESC or ASC", () => {
		let params = {
			sort: "DUST"
		};
		let baseUrl = "mockURL";

		expect(utils.queryParamsUrlHelper(baseUrl, params)).toBe(baseUrl);
	});


	it("should ignorepageNumber smaller than one", () => {
		let params = {
			pageNumber: 0
		};
		let baseUrl = "mockURL";

		expect(utils.queryParamsUrlHelper(baseUrl, params)).toBe(baseUrl);
	});


	it("should change Pagesize bigger then 100 to 100", () => {
		let params = {
			pageSize: 99999999
		};
		let baseUrl = "mockURL";

		expect(utils.queryParamsUrlHelper(baseUrl, params)).toBe('mockURL?pageSize=100');
	});

	it("should ignore pageSize smaller one ", () => {
		let params = {
			pageSize: 0
		};
		let baseUrl = "mockURL";

		expect(utils.queryParamsUrlHelper(baseUrl, params)).toBe(baseUrl);
	});


	it("should return all Parameters", () => {
		let params = {
			pageSize: 1,
			pageNumber: 1,
			filter: "testString",
			sort: "ASC",
			deep: true,
			meta: true
		};
		let baseUrl = "mockURL";

		let result = utils.queryParamsUrlHelper(baseUrl, params);
		expect(result).toBe('mockURL?pageSize=1&pageNumber=1&filter=testString&sort=ASC&deep=true&meta=true');

	});


	it("should return an Url with ID", () => {
		let params = {
			id: "1234"
		};
		let baseUrl = "mockURL";

		let result = utils.getParamsUrlHelper(baseUrl, params);

		expect(result).toBe('mockURL/1234');

	});

	it("should return all Parameters and full ID", () => {
		let params = {
			id: "abcd1234",
			deep: true,
			meta: true
		};
		let baseUrl = "mockURL";

		let result = utils.getParamsUrlHelper(baseUrl, params);
		expect(result).toBe('mockURL/abcd1234?deep=true&meta=true');

	});

	it("should return only deep & meta params that are 'true' or 'false' ", () => {
		let params = {
			id: "abcd1234",
			deep: false,
			meta: false
		};
		let baseUrl = "mockURL";

		let result = utils.getParamsUrlHelper(baseUrl, params);
		expect(result).toBe('mockURL/abcd1234');

	});

});
