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
	- [SelfbitsAngular: auth](#selfbitsangular-auth)
		- [auth.login(authData)](#authloginauthdata)
		- [auth.signup(authData)](#authsignupauthdata)
		- [auth.social(providerName)](#authsocialprovidername)
		- [auth.unlink(providerName)](#authunlinkprovidername)
		- [auth.password(newPassword, oldPassword)](#authpasswordnewpasswordstring-oldpasswordstring)
		- [auth.logout()](#authlogout)
		- [auth.getUserId()](#authgetuserid)
		- [auth.isAuthenticated()](#authisauthenticated)
		- [auth.signupAnonymous()](#authsignupanonymous)
	- [SelfbitsAngular: database](#selfbitsangular-database)
		- [database.databaseSchema(tableName)](#databasedatabaseschematablename)
	- [SelfbitsAngular: file](#selfbitsangular-file)
		- [file.get(params)](#filegetparams)
		- [file.upload(params)](#fileuploadparams)
	- [SelfbitsAngular: user](#selfbitsangular-user)
		- [user.current()](#usercurrent)
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

### `SelfbitsAngular: auth`

- [auth.login(authData)](#auth.login)
- [auth.signup(authData)](#auth.signup)
- [auth.social(providerName)](#auth.social)
- [auth.unlink(providerName)](#auth.unlink)
- [auth.password(newPassword, oldPassword)](#auth.password)
- [auth.logout()](#auth.logout)
- [auth.getUserId()](#auth.getuserid)
- [auth.isAuthenticated()](#auth.isauthenticated)
- [auth.signupAnonymous()](#auth.signupanonymous)


### auth.login(authData)

Sign in using email and password.


|Param | Type | Details|
|------|------ | ------|
|authData| `Object` | `{email:string, password:string}`|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|


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


### auth.signup(authData)

Sign up using email and password. 

* __Note__ Our Backend accepts only email and password properties for basic signup, everything else will be ignored
Don't forget to use angulars formbuilder to perform basic validations!


|Param | Type | Details|
|------|------ | ------|
|authData| `Object` | `{email:string, password:string}`|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

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

### auth.signupAnonymous()

Signup as anonymous user


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|


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

### auth.social(providerName)

Sign in __OR__ up using social providers. Opens a popup window, that leads the user through the social auth flow.

__Note__ Selfbits handles the complete OAuth flow in our backend. Please follow the Setup Guide in your Project > Authentication > Auth Provider


|Param | Type | Details|
|------|------ | ------|
|providerName|`string`| String with the Providername in lowercase, e.g. 'facebook' or 'github'|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|


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


### auth.unlink(providerName)

Unlink social providers from a user profile, so it become linkable from other accounts.
Does __NOT__ remove authentication rights from provider itself.


|Param | Type | Details|
|------|------ | ------|
|providerName|`string`| String with the Providername in lowercase, e.g. 'facebook' or 'github'|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

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


### auth.password(newPassword, oldPassword?)

Allows users  to update password or create one, if the user used social auth. 
You have to make sure to make necessary sanity checks for the new password (e.g. password repeat, password strength).


##### Parameters

|Param | Type | Details|
|------|------ | -------------|
|newPassword| `string` | The new password|
|oldPassword (optional)| `string` | The existing password (only required if a password already exists)|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|


##### Usage

```js
constructor(private sb: SelfbitsAngular) {

	this.sb.auth.password('oldPassword', 'newPassword').subscribe( res => {
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


### auth.logout()

Logs out the current user, removing Token, UserId and Expires from localStorage.


##### Usage

```js
constructor(private sb: SelfbitsAngular) {
	this.sb.auth.logout();
}
```

### auth.getUserId()

Returns the ID as String of the logged-in user from localStorage


##### Usage

```js

constructor(private sb: SelfbitsAngular) {

	this.sb.auth.getUserId();

}
```


### auth.isAuthenticated()

Returns boolean by checking if token exists in localStorage


##### Usage

```js
constructor(private sb: SelfbitsAngular) {

	this.sb.auth.password('oldPassword', 'newPassword').subscribe( res => {
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


### `SelfbitsAngular: database`

Create a database object with CRUD Methods on the fly


### database.databaseSchema(tableName)

Returns an instance of a SbHttp with CRUD Methods. 
Create by passing the SchemaId of your Collection on Selfbits.

|Param | Type | Details|
|------|------ | -------------|
|tableName| `string` | Name of the table/collection you want to query|


|Return|Type|Details|
|------|------ | ------|
|Object|SbHttp|Includes CRUD Methods (see below)|

##### Usage

```js
public todoDb;

constructor(private sb:SelfbitsAngular){
	this.todoDb = this.sb.database.databaseSchema('todo');
	
	this.todoDb.get(getParams).subscribe();
	this.todoDb.query(params?).subscribe();
	this.todoDb.post(todo).subscribe();
	this.todoDb.put(todo, id).subscribe();
	this.todoDb.delete(id).subscribe();
}
```


#### get(getParams)

get single item by ID, with optional params __deep__ and __meta__ booleans.

__deep__ When set to true, referenced children objects are fetched
__meta__ When set to true, shows timestamp and version metadata

|Param | Type | Details|
|------|------ | -------------|
|getParams| `Object` | `GetParams {id: any,deep?: boolean,meta?: boolean}`|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

####  query(queryParams?)

Get all items with optional mongoose filter as well as __deep__ and __meta__ booleans.
If no params are sent, then all items are fetched according to user roles settings.

|Param | Type | Details|
|------|------ | -------------|
|(Optional) queryParams| `Object` | `GetParams pageSize?: number,pageNumber?: number,filter?: string,sort?: string,deep?: boolean,meta?: boolean`|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

#### post(data)

Post data to the collection specified according to the created database.Schema('collectionName') instance.

|Param | Type | Details|
|------|------ | -------------|
|data| `Object` | according to collection created|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

#### put(data,id)

Update specific item according to id and replaces it with the data sent.

|Param | Type | Details|
|------|------ | -------------|
|data| `Object` | according to collection created|
|id|`string`|id of item to be updated|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

#### delete(id)

Removes item with specific id from collection.

|Param | Type | Details|
|------|------ | -------------|
|id|`string`|id of item to be deleted|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|


##### Example Todo

```js

//create a variable for a SelfbitsDatabaseObject
todoDb;

// Select the active database and bind the SelfbitsDatabaseObject to a variable
constructor(private sb: SelfbitsAngular) {
  this.todoDb = this.sb.database.databaseSchema('todo');
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
    description: 'Please get FRESH milk from Wholefoods'
}

this.todo.put(updateTodo,"57879806aeb310dc651899ef");

// delete a todo object in the database
this.todo.delete("57879806aeb310dc651899ef");

```

### `SelfbitsAngular: file`

```js
constructor(private sb:SelfbitsAngular){
	this.sb.file.get(params)
	this.sb.file.upload(params)
}
```

### file.get(params)
Get metadata of an uploaded file that contains a temporary download link.


|Param | Type | required | default | Details|
|-------|----- | -------|------|------|
|params| `Object` | true | | JavaScript object|
|params.fieldId | `string` | true | | JavaScript object|
|params.expiresInSeconds| `number` | false | 900 | JavaScript object|

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`| returns file metadata object containing url and expiresAt from the server|


##### Usage
```js

constructor(private sb: SelfbitsAngular) {

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
}
 ```

### file.upload(params)

Upload a file to the authenticated user's file store. Unified function that initiates, executes and verifies the upload.


|Param	|Type	|required	|default|	Details|
|----|----|---- | -------|------|
|params	| `Object`	|true	|	|JavaScript object containing upload information|
|params.file	| `file`	|true	|	| The file you want to upload|
|params.filePath	| `string`|	false	|params.file.name|	The destination path where you want to put the file. This path is prefixed by <PROJECT-ID>/<USER-ID>/|
|params.permissionScope	| `string`	|false	|user	|The permission scope: 'user' = only the uploading user can access the file. ' * ' : Every authenticated user can access the file with its fileId.|


|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`| returns file metadata object from the server|


##### Usage
```js

constructor(private sb: SelfbitsAngular) {

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
}
```


### `SelfbitsAngular: user`

### user.current()

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

##### Usage
```js

constructor(private sb: SelfbitsAngular) {

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
}
```

### `SelfbitsAngular: device`


### device.sync()

If an user is authenticeted this function will post user's mobile device informations to selfbits.

|Return|Type|Details|
|------|------ | ------|
|Observable|`Response`|Use toPromise() to transform to promise|

##### Usage
```js
constructor(private sb: SelfbitsAngular) {

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
}
```



## <a id="license"></a> License

Copyright (c) 2016 Selfbits GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
