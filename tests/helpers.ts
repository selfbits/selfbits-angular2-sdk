import {Headers} from "@angular/http";
import {SelfbitsAppConfig, SbAuthSucessResponse, SbUploadFile, SbExistingFile} from "../src/utils/interfaces";

export const TESTHEADERS:Headers =  new Headers({
	'Content-Type':'application/json',
	'sb-app-id':'fancyId',
	'sb-app-secret':'fancySecret'
});

export const TESTURL:string = 'www.test.io';

export const TESTCONFIG:SelfbitsAppConfig = {
	BASE_URL: 'www.test.io',
	APP_ID: 'fancyId',
	APP_SECRET: 'fancySecret'
};

export const TESTAUTHSUCESSRES:SbAuthSucessResponse = {
	token:'fancyToken',
	userId:'fancyUserId',
	expires:'fancyExpiration'
};

export const mockUploadFile:SbUploadFile = {
	file: "contentOfTheFile",
	fileName: "theFileName",
	filePath: "the/File/Path",
	permissionScope: 'user'
}


export const mockExistingFile:SbExistingFile  = {
	fileId: "18849e2abb34c23a",
	expiresInSeconds: 600000
}

export const mockUser  = {
	userId: "userId_ab134c23a"
}

export const mockRole  = {
	name: "mockAdmin"
}

