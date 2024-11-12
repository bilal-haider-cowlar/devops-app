

# Devops App Setup 

A brief description of how to setup & run this devops app.

## Services

This devops app use 3 services. 


- MYSQL for mangaging the data of the users.
- Valkey (alternate of redis) used for getting users data.
- Vernemq as a pub sub broker for realtime messaging.  

### How to run locally

We have provided a detail docker compose file which just needs an env file. A sample.env is also provided, you just have to change the envs according to you and run it. 

If the mysql is SSL secured as it will be on azure MYSQL service, then you need to provide a Digi cert for the connection. This certificate is already provided in /mount folder. It will be good to view the config/index.js file for the overAll concept of the envs. 

```
docker compose up -d
```

By a single command it will run all the services and node app. Node is already dockerized.

### Apis

Swagger is configured for all the apis in the project. When you will run the project, swagger will be available on 
```
appURL/api-docs
```
Proper documentatio will be find in it. 

- */health* is for testing mysql and redis connection
- */mqtt* is for posting a message on mqtt broker
- */auth/signup* is for signing up a new users
- */auth/login* is for loggin in
- */user/get-all* is for getting all users data 

On starting of the server, redis get sync and populated from mysql data. When you hit the */user/get-all* api it brings data from redis. 

