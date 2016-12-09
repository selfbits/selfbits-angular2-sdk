![Project Logo](http://i.imgur.com/mAYkfSt.jpg)


# [Selfbits Angular2 SDK](https://github.com/selfbits/selfbits-angular2-sdk)

This package enables you to easily integrate [Selfbits' Backend-as-Service](https://www.selfbits.io) into your **Angular 2 projects**.
Selfbits allows you to skip backend development and focus on what's most important for you: your user-experience.


Please note that you MUST have a Selfbits account and an active Project to use the service. Check out <https://www.selfbits.io> for more info.

**Note**: Check out our sdk for [AnguarJS](https://github.com/selfbits/selfbits-angular-sdk) and various [starter templates](https://github.com/selfbits)!


## Features

- **auth** - Provides Social & Basic Auth
- **database** - Puts a ready to use database integration at your fingertips
- **file** - Provides easy to use file storage for your App
- **user** - Handles interaction with user data
- **device** - Handles data from the device (Cordova only)
- **push** - Provides Push Notification (Cordova only)



![Background Auth](http://i.imgur.com/94cDviv.jpg?1)





## Contents

- [Installation](#installation)

- [Setup in ngModule](#setup)

- [Usage](#usage)
  - [Usage in Components](#usage-in-components)
  - [Usage in Services](#usage-in-services)

- [Implementation with popular templates](#implementation-with-popular-templates)
  - [SystemJS Based](#systemjs-based)
      - [Angular 2 Quickstart](#angular-2-quickstart)
      - [Angular 2 Seed](#angular-2-seed)
  - [Webpack Based](#systemjs-based)
      - [Angular 2 Starter Webpack](#angular-2-starter-webpack)
      - [Angular Cli](#angular-cli)

- [API Reference](#api-reference)
  - [SelfbitsAngular: auth](#selfbitsangular-auth)
    - [auth.login(authData)](#auth-login-authdata-)
    - [auth.signup(authData)](#auth-signup-authdata-)
    - [auth.social(providerName)](#auth-social-providername-)
    - [auth.unlink(providerName)](#auth-unlink-providername-)
    - [auth.password(newPassword, oldPassword)](#auth-password-newpassword-oldpassword-)
    - [auth.logout()](#auth-logout-)
    - [auth.getUserId()](#auth-getuserid-)
    - [auth.isAuthenticated()](#auth-isauthenticated-)
    - [auth.signupAnonymous()](#auth-signupanonymous-)

  - [SelfbitsAngular: database](#selfbitsangular-database)
    - [database.databaseSchema()](#database-databaseschema-tablename-)

  - [SelfbitsAngular: file](#selfbitsangular-file)
    - [file.get()](#file-getparams-)
    - [file.upload()](#file-uploadparams-)

  - [SelfbitsAngular: user](#selfbitsangular-user)
    - [user.current()](#user-current-)

  - [device](#selfbitsangular-device)
    - [device.sync()](#device-sync-)

- [License](#license)

## Installation

<img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" height="22" align="top"> NPM
```
npm install selfbits-angular2-sdk --save
```

## Setup

Go to your root ngModule (usually app.module.ts).
Add your Selfbits app credentials to SELFBITSCONFIG and initialize by importing SelfbitsAngularModule.initializeApp (SELFBITSCONFIG).  *You find your Selfbits app credential, when you access the dashboard of your project and click on the gear-icon in the left column, next to your project name.*

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
    APP_SECRET:'yourSbAppSecret',
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


## Usage

Our sdk can be consumed directly inside your components.

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

## Implementation with popular templates

### SystemJS Based

With SystemJS you need to configure the **system.config.js** file in order to have the sdk loaded. The config file usually sits directly in the root folder.

#### Angular 2 Quickstart

This is the offical [quickstart template](https://github.com/angular/quickstart) found on angular.io.

```javascript
map:{
    (...)
    // other libraries
    'rxjs':                       'npm:rxjs',
    'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
    'selfbits-angular2-sdk':      'npm:selfbits-angular2-sdk/dist' // This tells SystemJs WHERE to look for the sdk, don't forget /dist!
    },
packages: {
    (...)
    'angular2-in-memory-web-api': {
        main: './index.js',
        defaultExtension: 'js'
    },
    'selfbits-angular2-sdk':{ // this tells SystemJs WHAT to load, in our case the sdk's entry point
        main:'./index.js',
        defaultExtension: 'js'
    }
    rxjs: {
        main: './Rx.js', // if console shows rxjs not found, then add this line
        defaultExtension: 'js'
    }
}
(...)
```

#### Angular 2 Seed

[Angular 2 Seed by mgechev](https://github.com/mgechev/angular2-seed) is one of the most popular angular 2 starter templates based on SystemJS. The system.config.js is devided to **project.config.ts** and **seed.config.ts** and can be found under root > tools > config.

```javascript
SYSTEM_CONFIG_DEV: any = {
    defaultJSExtensions: true,
    packageConfigPaths: [
      `/node_modules/*/package.json`,
      `/node_modules/**/package.json`,
      `/node_modules/@angular/*/package.json`
    ],
    paths: {
        (...)
        'rxjs/*': 'node_modules/rxjs/*',
        'selfbits-angular2-sdk':'node_modules/selfbits-angular2-sdk/dist/index.js', // here you need to specify the whole file path
        'app/*': '/app/*',
    },
};

SYSTEM_BUILDER_CONFIG: any = {
    (...)
    packages: {
        (...)
        'rxjs': {
            defaultExtension: 'js'
        },
        'selfbits-angular2-sdk':{ // and again the package infos
            main: 'index.js',
            defaultExtension: 'js'
        }
    }
};
```

### Webpack Based

All you need to do is to install and setup the sdk as described above (in app.module.ts). Webpack will take care of the rest for us. Here are some templates you can start with.

#### Angular 2 Starter Webpack
This popular [template](https://github.com/AngularClass/angular2-webpack-starter) is created from the people of [Angular Class](https://angularclass.com/) and uses Webpack to bundle the files.

#### Angular CLI
A powerful and convenient [CLI tool](https://github.com/angular/angular-cli) for creating, serving and testing angular 2

## API Reference

### Always import SelfbitsAngular

```javascript
import {SelfbitsAngular} from 'selfbits-angular2-sdk';
```

### SelfbitsAngular: auth

- [auth.login(authData)](#auth-login-authdata-)
- [auth.signup(authData)](#auth-signup-authdata-)
- [auth.social(providerName)](#auth-social-providername-)
- [auth.unlink(providerName)](#auth-unlink-providername-)
- [auth.password(newPassword, oldPassword)](#auth-password-newpassword-oldpassword-)
- [auth.logout()](#auth-logout-)
- [auth.getUserId()](#auth-getuserid-)
- [auth.isAuthenticated()](#auth-isauthenticated-)
- [auth.signupAnonymous()](#auth-signupanonymous-)

#### auth.login(authData)

Sign in using email and password.

###### Parameters

Param    | Type     | Details
-------- | -------- | ---------------------------------
authData | `Object` | `{email:string, password:string}`

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

###### Usage

```javascript
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

#### auth.signup(authData)

Sign up using email and password.

- **Note** Our Backend accepts only email and password properties for basic signup, everything else will be ignored Don't forget to use angulars formbuilder to perform basic validations!

##### Parameters

Param    | Type     | Details
-------- | -------- | ---------------------------------
authData | `Object` | `{email:string, password:string}`

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

#### auth.signupAnonymous()

Signup as anonymous user

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

#### auth.social(providerName)

Sign in **OR** up using social providers. Opens a popup window, that leads the user through the social auth flow.

__Selfbits handles the complete OAuth flow in our backend. Please follow the Setup Guide in your Selfbits Admin Panel under: Project > Authentication > Auth Provider__

##### Parameters

Param        | Type     | Details
------------ | -------- | ----------------------------------------------------------------------
providerName | `string` | String with the Providername in lowercase, e.g. 'facebook' or 'github'

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

#### auth.unlink(providerName)

Unlink social providers from a user profile, so it become linkable from other accounts. Does **NOT** remove authentication rights from social provider itself.

##### Parameters

Param        | Type     | Details
------------ | -------- | ----------------------------------------------------------------------
providerName | `string` | String with the Providername in lowercase, e.g. 'facebook' or 'github'

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

#### auth.password(newPassword, oldPassword?)

Allows users to update password or create one, if the user used social auth. You have to make sure to make necessary sanity checks for the new password (e.g. password repeat, password strength).

##### Parameters

Param                  | Type     | Details
---------------------- | -------- | ------------------------------------------------------------------
newPassword            | `string` | The new password
oldPassword (optional) | `string` | The existing password (only required if a password already exists)

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript
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

#### auth.logout()

Helper Method which removes Token, UserId and Expires from localStorage.

##### Returns

- **Void**

##### Usage

```javascript
constructor(private sb: SelfbitsAngular) {
    this.sb.auth.logout();
}
```

#### auth.getUserId()

##### Returns

- **String** - Returns the UserID as String by retrieving it from the localStorage

##### Usage

```javascript

constructor(private sb: SelfbitsAngular) {

    this.sb.auth.getUserId();

}
```

#### auth.isAuthenticated()

Performs a user.current() http request with the current token, in order to check validity. Returns Observable

<boolean>, can be use for angular 2 routing guards</boolean>

##### Returns

- **Observable** - Returns Observable of type boolean

##### Usage

```javascript
import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

@Injectabe()

export class RoutingGuard implements CanActivate {
    constructor(private sb: SelfbitsAngular) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean> || boolean {
        return this.sb.auth.isAuthenticated()
    }
}
```

### SelfbitsAngular: database

Create a database object with CRUD Methods on the fly

#### database.databaseSchema(tableName)

Returns an instance of a SbHttp with CRUD Methods. Create by passing the SchemaId of your Collection on Selfbits.

##### Parameters

Param     | Type     | Details
--------- | -------- | ----------------------------------------------
tableName | `string` | Name of the table/collection you want to query

##### Returns

- **Object** - returns a SelfbitsHttp object

##### Usage

```javascript
public todoDb:SelfbitsHttp; // typing it provides intelliSense for IDE

constructor(private sb:SelfbitsAngular){
    this.todoDb = this.sb.database.databaseSchema('todo');

    this.todoDb.get(getParams).subscribe();
    this.todoDb.query(params).subscribe(); // params optional
    this.todoDb.post(todo).subscribe();
    this.todoDb.put(todo, id).subscribe();
    this.todoDb.delete(id).subscribe();
}
```

#### get(getParams)

get single item by ID, with optional params **deep** and **meta** booleans.

**deep** When set to true, referenced children objects are fetched **meta** When set to true, shows timestamp and version metadata

###### Parameters

Param     | Type     | Details
--------- | -------- | -----------------------------------------------------
getParams | `Object` | `SbGetParams {id: any,deep?: boolean,meta?: boolean}`

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

#### query(queryParams?)

Get all items with optional mongoose filter as well as **deep** and **meta** booleans. If no params are sent, then all items are fetched according to user roles settings.

###### Parameters

Param                  | Type     | Details
---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------
(Optional) queryParams | `Object` | `SbGetParams pageSize?: number,pageNumber?: number,filter?: string,sort?: string,deep?: boolean,meta?: boolean`

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

#### post(data)

Post data to the collection specified according to the created database.Schema('collectionName') instance.

###### Parameters

Param | Type     | Details
----- | -------- | -------------------------------
data  | `Object` | according to collection created

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

#### put(data,id)

Update specific item according to id and replaces it with the data sent.

Param | Type     | Details
----- | -------- | -------------------------------
data  | `Object` | according to collection created
id    | `string` | id of item to be updated

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

#### delete(id)

Removes item with specific id from collection.

###### Parameters

Param | Type     | Details
----- | -------- | ------------------------
id    | `string` | id of item to be deleted

###### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Example Todo

```javascript

//create a variable for a SelfbitsDatabaseObject
private todoDb:SelfbitsHttp;
private todos =[];
private myTodo;

// Select the active database and bind the SelfbitsDatabaseObject to a variable
constructor(private sb: SelfbitsAngular) {
  this.todoDb = this.sb.database.databaseSchema('todo');

  // retrieve all todo and request meta data and deep-linked objects
  this.todoDb.query({ meta: true, deep: true}).subscribe(res => {
    this.todos = res.json() // just passing a reference WITHOUT typing, if typing is needed add a map operator before subscribe
  })

  // retrieve single todo by id and bind it to variable
  this.todo.get({ID:"57879806aeb310dc651899ef"}).subscribe(res => this.myTodo = res.json());

  // save a todo object to the database
  let newTodo = {
      title: 'Buy Milk',
      description: 'Please get fresh milk from Wholefoods'
  }
  this.todo.post(newTodo).subscribe(res => console.log(res));

  // update a todo object in the database
  let updateTodo = {
      description: 'Please get FRESH milk from Wholefoods'
  }
  this.todo.put(updateTodo,"57879806aeb310dc651899ef");

  // delete a todo object in the database
  this.todo.delete("57879806aeb310dc651899ef");
}

```


### SelfbitsAngular: file

```javascript
constructor(private sb:SelfbitsAngular){
    this.sb.file.get(params).subscribe()
    this.sb.file.upload(params).subscribe()
}
```

#### file.get(params)

Get metadata of an uploaded file that contains a temporary download link.

##### Parameters

Param                   | Type     | required | default | Details
----------------------- | -------- | -------- | ------- | -----------------
params                  | `Object` | true     |         | JavaScript object
params.fieldId          | `string` | true     |         | JavaScript object
params.expiresInSeconds | `number` | false    | 900     | JavaScript object

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

#### file.upload(params)

Upload a file to the authenticated user's file store. Unified function that initiates, executes and verifies the upload.

##### Parameters

Param                  | Type     | required | default          | Details
---------------------- | -------- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------
params                 | `Object` | true     |                  | JavaScript object containing upload information
params.file            | `file`   | true     |                  | The file you want to upload
params.filePath        | `string` | false    | params.file.name | The destination path where you want to put the file. This path is prefixed by

<project-id>/<user-id>/</user-id></project-id>
params.permissionScope | `string` | false    | user             | The permission scope: 'user' = only the uploading user can access the file. ' * ' : Every authenticated user can access the file with its fileId.

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

### SelfbitsAngular: user

#### user.current()

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript

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

### SelfbitsAngular: device

#### device.sync()

If an user is authenticeted this function will post user's mobile device informations to selfbits.

##### Returns

- **Observable** - default angular 2 HTTP observable of type Response.

##### Usage

```javascript
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

## License

Copyright (c) 2016 Selfbits GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
