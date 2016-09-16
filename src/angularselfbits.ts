import { NgModule, ModuleWithProviders } from '@angular/core';
import { Injectable } from '@angular/core';

import {
	SelfbitsAuth,
	SelfbitsDatabase,
	SelfbitsFile,
	SelfbitsUser,
	SelfbitsDevice,
	SelfbitsPush
} from './services/';

import { SelfbitsAppConfig } from './utils/interfaces';

import { HttpModule } from '@angular/http';

@Injectable()
export class SelfbitsAngular {
	constructor(
		public auth : SelfbitsAuth,
		public database : SelfbitsDatabase,
		public file : SelfbitsFile,
		public user : SelfbitsUser,
		public device: SelfbitsDevice,
		public push : SelfbitsPush
	){}
}

// RC4 Provider loader
export const SELFBITS_PROVIDERS:any[] = [
	SelfbitsAngular,
	SelfbitsAuth,
	SelfbitsDatabase,
	SelfbitsFile,
	SelfbitsUser,
	SelfbitsDevice,
	SelfbitsPush
];

export const SelfbitsSetup = (appConfig: SelfbitsAppConfig): any => {
		return [
			{ provide: 'SelfbitsConfig', useValue: appConfig }
		]
};

// RC5+ using ngModule to load providers
@NgModule({
	providers:SELFBITS_PROVIDERS,
	imports:[ HttpModule ]
})

export class SelfbitsAngularModule{
	static initializeApp(config:SelfbitsAppConfig):ModuleWithProviders{
		return {
			ngModule:SelfbitsAngularModule,
			providers:[
				{ provide: 'SelfbitsConfig', useValue: config }
			]
		}
	}
}
