# selfbits-angular2-sdk

This package allows you to easily integrate the Selfbits Backend-as-Service into your Angular2 projects. Please note that you MUST have a Selfbits BaaS Account and an active Project to use the service. Check out http://baas.selfbits.io for more info.

Selfbits Backend-as-Service allows you to skip backend development and focus on what's most important for you: your user-experience.


## Features
* __auth__ - Provides Social & Basic Auth
* __database__ - Puts a ready to use database integration at your fingertips
* __file__ - Provides easy to use file storage for your App
* __user__ - Handles interaction with user data
* __device__ - Handles data from the device (Cordova only)
* __push__ - Provides Push Notifcation (Cordova only)


## Contents

- [Installation](#installation)
- [Setup](#setup)
	- [Setup via ngModule](#setup-via-ngmodule-since-rc5)
    - [Setup via bootstrap](#setup-via-boostrap-before-rc5)
- [Usage](#usage)
	- [Usage in Components](#usage-in-components)
	- [Usage in Services](#usage-in-services)
- [API Reference](#api-reference)
	- [SelfbitsAngular: auth](#auth)
		- [auth.login(authData)](#auth.login)
		- [auth.signup(authData)](#auth.signup)
		- [auth.social(providerName)](#auth.social)
		- [auth.unlink(providerName)](#auth.unlink)
		- [auth.password(newPassword, oldPassword)](#auth.password)
		- [auth.logout()](#auth.logout)
		- [auth.getUserId()](#auth.getuserid)
		- [auth.isAuthenticated()](#auth.isauthenticated)
		- [auth.signupAnonymous()](#auth.signupanonymous)
	- [SelfbitsAngular: database](#database)
		- [database.databaseSchema(tableName)](#database.databaseSchema)
	- [SelfbitsAngular: file](#file)
		- [file.get(params)](#file.get)
		- [file.upload(params)](#file.upload)
	- [SelfbitsAngular: user](#user)
		- [user.current()](#user.current)
	- [device](#device)
		- [device.sync()](#device.sync)
- [License](#license)


## Installation

```
npm install selfbits-angular2-sdk --save
```

##  Setup

### Setup via ngModule (since RC5)
```javascript

import {SelfbitsAngularModule} from 'selfbits-angular2-sdk';

const SELFBITSCONFIG = {
  /* Your App Domain */
	BASE_URL:'YourSbAppDomain',
  /* Your Selfbits App ID */
	APP_ID:'yourSbAppId',
  /* OPTIONAL: your Selfbits App Secret
     NOTE: on public clients we highly recommend to set Allowed Origins
     in your Selfbits BaaS Project Dashboard instead of using the Secret
  */  
	APP_SECTRET:'yourSbAppSecret',
};

@NgModule({
	imports: [
		/* other imports */
		SelfbitsAngularModule.initializeApp(SELFBITSCONFIG)
	],
	/*...your other providers, declarations,..*/
})
export class AppModule { }

```

### Setup via boostrap (before RC5)
```javascript

import {SelfbitsSetup, SELFBITS_PROVIDERS} from 'selfbits-angular2-sdk';

const SELFBITSCONFIG = {
  /* Your App Domain */
	BASE_URL:'YourSbAppDomain',
  /* Your Selfbits App ID */
	APP_ID:'yourSbAppId',
  /* OPTIONAL: your Selfbits App Secret
     NOTE: on public clients we highly recommend to set Allowed Origins
     in your Selfbits BaaS Project Dashboard instead of using the Secret
  */  
	APP_SECTRET:'yourSbAppSecret',
};

bootstrap(
	AppComponent,
	[
		SelfbitsSetup(SELFBITSCONFIG),
		SELFBITS_PROVIDERS
	]
);
```

## Usage

* __Note__: Our sdk is designed, so that you can consume them directly inside your components. 

### Usage in Components

```javascript

import { SelfbitsAngular } from 'selfbits-angular2-sdk';

export class LoginComponent {

  constructor(private sb:SelfbitsAngular) {}

  login(authData) {
  		this.sb.auth.login(authData).subscribe( res => {
  	        // DO SOMETHING AFTER LOGIN
  	    })
  	}
  }
}
```

### Usage in Services

Of course feel free to wrap our methods in your own services!

```javascript
import { Injectable } from '@angular/core'
import { SelfbitsAngular } from 'selfbits-angular2-sdk';

@Injectable()
export class TodoDatabaseService {

	public todo;
	
	constructor(private sb:SelfbitsAngular) {
		this.todo = this.sb.database.dataSchema('todo');
	}   
	
	createTodo(todo) {
		this.todo.post(todo)
			.map( res => { /*do something*/ return res})
			.subscribe( res => {
				console.log(res.json())
	        })
	}
}
```

## API Reference

### Always import SelfbitsAngular
```javascript
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
```

### <a id="auth"></a> `SelfbitsAngular: auth`

- [auth.login(authData)](#auth.login)
- [auth.signup(authData)](#auth.signup)
- [auth.social(providerName)](#auth.social)
- [auth.unlink(providerName)](#auth.unlink)
- [auth.password(newPassword, oldPassword)](#auth.password)
- [auth.logout()](#auth.logout)
- [auth.getUserId()](#auth.getuserid)
- [auth.isAuthenticated()](#auth.isauthenticated)
- [auth.signupAnonymous()](#auth.signupanonymous)


#### <a id="auth.login"></a> `auth.login(authData) : Observable<Response>`

Sign in using email and password.

##### Parameters

|Param | Type | Details|
|------|------ | ------|
|authData| `Object` | `{email:string, password:string}`|


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.


#### Usage
```js
/* Place code below inside Component or Service */

constructor(private sb: SelfbitsAngular) {

	let authData = {
	    email: 'abc@def.de',
	    password: 'mypassword'
	}
	
	/* This code could go in any method */
	this.sb.auth.login(authData).subscribe(res => {
		if (res.status === 200){
		  // Redirect user here after a successful login.';
		}
		else{
		    // Handle errors depndening the response, such as 401 unauthorized
		}
		}, err => console.log(err)
	);
}
```


#### <a id="auth.signup"></a> `auth.signup(authData) : Observable<Response>`

Sign up using email and password. 
* __Note__ Our Backend accepts only email and password properties for basic signup, everything else will be ignored
Don't forget to use angulars formbuilder to perform basic validations!


##### Parameters

|Param | Type | Details|
|------|------ | ------|
|authData| `Object` | `{email:string, password:string}`|


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.

##### Usage

```js

constructor(private sb: SelfbitsAngular) {

	let user = {
	    email: 'abc@def.de',
	    password: 'mypassword'
	}

	this.sb.auth.signup(authData).subscribe( res => {
	     if (res.status === 200){
	       // Redirect user here after a successful login.';
	     }
	     else{
	       // Handle errors depndening the response, such as 401 unauthorized
	     }
	   }, err => console.log(err)
	);
}
```

#### <a id="auth.signupanonymous"></a> `auth.signupAnonymous()`

Signup as anonymous user


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.


##### Usage

```js

constructor(private sb: SelfbitsAngular) {

	this.sb.auth.signupAnonymous().subscribe( res => {
		if (res.status === 200){
			// Redirect user here after a successful login.';
		}
		else{
			// Handle errors depndening the response, such as 401 unauthorized
		}
		}, err => console.log(err)
	);
}
```

#### <a id="auth.social"></a> `auth.social(providerName:string) : Observable<Response>`

Sign in __OR__ up using social providers. Opens a popup window, that leads the user through the social auth flow.

__Note__ Selfbits handles the complete OAuth flow in our backend. Please follow the Setup Guide in your Project > Authentication > Auth Provider


##### Parameters

Param | Type | Details
------------ | -------------
providerName|`string`| String with the Providername in lowercase, e.g. 'facebook' or 'github'


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.


##### Usage

```js

constructor(private sb: SelfbitsAngular) {

	this.sb.auth.social('facebook').subscribe( res => {
		if (res.status === 200){
		  // Redirect user here after a successful login.';
		}
		else{
		  // Handle errors depndening the response, such as 401 unauthorized
		}
		}, err => console.log(err)
	);
}
```


#### <a id="auth.unlink"></a> `auth.unlink(providerName:string) : Observable<Response>`

Unlink social providers from a user profile, so it become linkable from other accounts.
Does __NOT__ remove authentication rights from provider itself.


##### Parameters

Param | Type | Details
------------ | -------------
providerName| `string` | String with the Providername, e.g. 'facebook' or 'google'


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.


##### Usage

```js

constructor(private sb: SelfbitsAngular) {
	this.sb.auth.social('facebook').subscribe( res => {
			 if (res.status === 200){
			   // Redirect user here after a successful login.';
			 }
			 else{
			   // Handle errors depndening the response, such as 401 unauthorized
			 }
		}, err => console.log(err)
	);
}

```


#### <a id="auth.password"></a> `auth.password(newPassword:string, oldPassword?:string)`

Allows users  to update password or create one, if the user used social auth. 
You have to make sure to make necessary sanity checks for the new password (e.g. password repeat, password strength).


##### Parameters

Param | Type | Details
------------ | -------------
newPassword| `string` | The new password
oldPassword (optional)| `string` | The existing password (only required if a password already exists)


##### Returns

Observable<Response> 
Use toPromise() operator to transform to promise.


##### Usage

```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


this.sb.auth.password('oldPassword', 'newPassword').subscribe(
  res => {
    if (res.status === 200){
      // Do something
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);
```


#### <a id="auth.logout"></a> `auth.logout()`

Logs out the current user, removing the Token and the UserId from localStorage.


##### Usage

```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


this.sb.auth.logout();
```

#### <a id="auth.getuserid"></a> `auth.getUserId()`

Returns the ID of the logged-in user for use e.g. in database querys.

##### Usage

```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


this.sb.auth.getUserId();
```




#### <a id="auth.isauthenticated"></a> `auth.isAuthenticated()`

Returns true if an authenticated user exists on the client

##### Usage

```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


this.sb.auth.password('oldPassword', 'newPassword').subscribe(
  res => {
    if (res.status === 200){
      // Do something
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);
```



### <a id="database"></a> `SelfbitsAngular: database`

```js
#creating a SelfbitsDatabaseObject
 database.databaseSchema(tableName)

#using methods on the SelfbitsDatabaseObject
 dbObject.post(data)
 dbObject.get(params)
 dbObject.query(params)
 dbObject.put(data,id)
 dbObject.delete(id)
```


#### <a id="database.databaseSchema"></a> `database.databaseSchema(tableName)`

Select a table/collection you previously defined in the Admin Dashboard to run operations on it.

##### Parameters

Param | Type | Details
------------ | -------------
tableName| `string` | Name of the table/collection you want to query


##### Returns

returns a SelfbitsDatabaseObject with that you can access to further functionalities

##### Usage

The SelfbitsDatabaseObject is a powerful tool to manipulate data in the database in a REST-Style manner. Our API offers the get save, update and delete methods to retrieve and edit data in a specific table. Please read the linked docs to get a deeper understanding, as covering all the mechanics here is not possible. Despite, we provide a few examples to demonstrate what's possible.

```js

import {SelfbitsAngular} from "../../sdk/src/angularselfbits";

//create a variable for a SelfbitsDatabaseObject
todoDb;

// Select the active database and bind the SelfbitsDatabaseObject to a variable
constructor(private sb: SelfbitsAngular) {
  this.todoDb = this.sb.database.databaseSchema('test');
}


// retrieve all todos and bind them to a variable
todos = this.todo.query();

// retrieve single todo by id and bind it to variable
myTodo =  this.todo.get({ID:"57879806aeb310dc651899ef"});

// retrieve all todos and bind them to a variable
// but this time also request meta data and deep-linked objects
myTodos = this.todo.query({ meta: true, deep: true});

// save a todo object to the database
let newTodo = {
    title: 'Buy Milk',
    description: 'Please get fresh milk from Wholefoods'
}
this.todo.post(newTodo);

// use custom error and result handling
this.todo.post(todo).subscribe(
  res => {
    if (res.status === 200){
      // Do something
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);

// update a todo object in the database
let updateTodo = {
    description: 'Please get cheap milk from Wholefoods'
}
this.todo.put(updateTodo,"57879806aeb310dc651899ef");

// delete a todo object in the database
this.todo.delete("57879806aeb310dc651899ef");

```

### <a id="file"></a> `SelfbitsAngular: file`

```js
file.get(params)
file.upload(params)
```

#### <a id="file.get"></a> `file.get(params)`
Get metadata of an uploaded file that contains a temporary download link.

#### Parameters
Param | Type | required | default | Details
------------ | -------------
params| `Object` | true | | JavaScript object
params.fieldId | `string` | true | | JavaScript object
params.expiresInSeconds| `number` | false | 900 | JavaScript object


#### Returns
response the file metadata object containing url and expiresAt from the server

##### Usage
```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


let params = {
  fileId: 'YOUR-FILE-ID',
  expiresInSeconds: 60
}

this.file.get(params).subscribe(
  res => {
    if (res.status === 200){
      // do something with file metadata response
      let downloadLink = res.url;
      // use download link as long as it is valid
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);
 ```

#### <a id="file.upload"></a> `file.upload(params)`

Upload a file to the authenticated user's file store. Unified function that initiates, executes and verifies the upload.

#### Parameters

Param	|Type	|required	|default|	Details
------------ | -------------
params	| `Object`	|true	|	|JavaScript object containing upload information
params.file	| `file`	|true	|	| The file you want to upload
params.filePath	| `string`|	false	|params.file.name|	The destination path where you want to put the file. This path is prefixed by <PROJECT-ID>/<USER-ID>/
params.permissionScope	| `string`	|false	|user	|The permission scope: 'user' = only the uploading user can access the file. ' * ' : Every authenticated user can access the file with its fileId.

#### Returns

response the file metadata object from the server

##### Usage
```js

import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


let f = new File(["plain text file content"], "filename.txt")
let params = {
  file: f,
  filePath: 'myFile.txt'
}
this.sb.file.upload(params).subscribe(
  res => {
    if (res.status === 200){
      // do something with file metadata response
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);

```


### <a id="user"></a> `SelfbitsAngular: user`


#### <a id="user.current"></a> `user.current()`



##### Returns

* __response__ the HTTP response object from the server

##### Usage
```js

constructor(private sb: SelfbitsAngular) {}

this.sb.user.current().subscribe(
  res => {
    if (res.status === 200){
      // do something with the data
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);
```

### <a id="device"></a> `SelfbitsAngular: device`


#### <a id="device.sync"></a> `device.sync()`

If an user is authenticeted this function will post user device informations to selfbits.

##### Returns

* __response__ the HTTP response object from the server

##### Usage
```js
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
constructor(private sb: SelfbitsAngular) {}


this.sb.device.sync().subscribe(
  res => {
    if (res.status === 200){
      // do something with the data
    }
    else{
      // Handle errors here, such as displaying a notification
    }
  }
);
```



## <a id="license"></a> License

Copyright (c) 2016 Selfbits GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
