# Welcome to KeepFiles V1

KeepFiles is a file host and link shortener that empowers server hosts to effectively manage users, administrators, and their site in general. I built the site with the idea that this could grow into something that really has everything you need in one convenient spot. For now, I would say it's a great utility - but there's always room for improvements. Be sure to reach out about any features that you think would make this tool even better.

# Release Notes
This is an **extremely** early release. There is essentially no front-end functionality at this point. The APIs are in place for it to happen, but, it is not quite ready yet.

By **May 1st**,  the following will be implemented:
* Users will be able to sign up & log in through the website.
* Users will be able to view their links and files through the website.
* Users will be able to explicitly request API keys.
* Administrators will have access to a dashboard to manage users, API keys, and the site.

## Requirements

* Node.JS (latest recommended)
* MongoDB
* Persistent File System
	* Some hosts, such as Heroku, use ephemeral file systems. That means you'll lose all the files you upload whenever your process resets. I'll be releasing a fork of this project to make it work with such hosts, but it is on the backburner currently
## Installation

```
git clone https://github.com/julianwastkn/keepfiles.git
cd keepfiles
npm i
```

## Getting Started


#### Environment Variables
First off, you'll need to create a database with MongoDB and save the Connection String you get.

Once you do that, come up with a secret that'll be used to create your JWTs, the tokens users get when they sign-in to the website. It can be anything you want - just make it secure!

Now that you have the necessary information, you can fill out `.env.example` and take `.example` out of the name.

#### Configuration 
There is not much to configure in the project at this point. In `config.js`, you can toggle the URL that is used in responses,  sign-ups, the length of file/link names, and permission levels.

#### Starting The Server

Once you've made it to this point, your server is ready to run! All you have to do is run `index.js` with node.

## API documentation

### GET
|Route |                         Headers                          |Body / Notes|  
|----------------|-------------------------------|-----------------------------|
|`GET  ​/resources/:folder/:file`|                           |Fetch static resources.       
|`GET  ​/:page?`                 |                           |Fetches :page from /html, or index.
|`GET  /api/stats`             |                           |Fetches number of files, links, and users.
|`GET  /api/all-files`         | `Authorization: API-Key`  |Fetches JSON of all files by provided user.
|`GET  /api/all-links`         | `Authorization: API-Key`  |Fetches JSON of all links by provided user.
|`GET  /f/:file`               |                           |Fetches the requested file.
|`GET  /l/:link`               |                           |Redirects to the associated link.  


### POST
|Route |                         Headers                          |Body / Notes|  
|----------------|-------------------------------|-----------------------------|
|`POST /api/signup`             |                             | `{ email, username, password }`
|`POST /api/signin`             |                             | `{ username, password }`
|`POST /api/grant-api-access`   |  `Authorization: API-Key`   | `{ receiver: ReceiverUsername }`
|`POST ​‍/api/files`              | `Authorization: API-Key`    | Form Data, `{ file }`.
|`POST /api/links`              | `Authorization: API-Key`    | Form Data, `{ link }`.

### DELETE
|Route |                         Headers                          |Body / Notes|  
|----------------|-------------------------------|-----------------------------|
|`DELETE ​/api/files/:file` | `Authorization: API-Key` | Deletes file from storage & record from Mongo.
|`DELETE ​/api/links/:link` | `Authorization: API-Key` | Deletes link from Mongo.