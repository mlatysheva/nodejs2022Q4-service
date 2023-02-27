# Home Library Service

This is a Nestjs RESTful music library application that can do the following:
- create and update a user
- create, update and delete a track, get a single track by id and get all tracks
- create, update and delete an artist, get a single artist by id and get all artists
- create, update and delete an album, get a single album by id and get all albums
- add, update and delete a track, artist or album to/from the user's favorites

In the second part I added `Docker` to deploy the app and the database that will be used to store the information.
The database is a `postgres` database and `Typeorm` ORM tool is used to create relations and manipulate the data in the database from the app.

In the third part I added a Custom Logger, a Database Logger and an Exception Filter to log messages and errors.

## The stack used
- Docker
- Postgresql
- Typeorm
- Nestjs
- Typescript
- Eslint/Prettier
- Swagger

## Downloading, Installing and Running the App

- Clone the repository by running `git clone https://github.com/mlatysheva/nodejs2022Q4-service.git`
- On your local machine `cd` into the folder with the cloned repository
- Install all NPM dependencies by running `npm i` from the command line
- Rename the file `.env.example` into `.env`
- Launch `Docker Desktop` on your local machine
- Create docker containers for the app and the database by running:
`npm run docker:build`
- The following commands are available to work with the docker: 
  - `npm run docker:start` to start the containers
  - `npm run docker:stop` to stop the containers
  - `npm run docker:test` to run the e2e tests inside the docker
  - `npm run docker:scan:app` to scan the application for vulnerabilities
  - `npm run docker:scan:db` to scan the database for vulnerabilities
  - `npm run docker:scan` to scan both the database and the app for vulnerabilities

- Once the app is running in the docker container, run migrations to populate the database:
- first run `npm run migration:generate` to generate the migrations
- then run `npm run migration:run` to run the migrations
After the migrations have been applied to the database, run the tests by
- `npm run test`

- The application is running by default on port 4000
- The postgres database is running by default on port 5432
- Once the application is running, you can make CRUD requests to the relevant endpoints
![Sample of a Postman Request](screenshots/screenshot_postman_track.png)

- There is a swagger file showing available endpoints and required request body and response body at http://localhost:4000/doc/

![Swagger api](screenshots/screenshot_swagger_api.png)
![Swagger track](screenshots/screenshot_swagger_track.png)

## Testing

Once the application and database are running inside relevant Docker containers, run the tests by:

- `npm run test`

![Results of the tests inside Docker](screenshots/screenshot_docker_tests.png)


- The image of the application is 485 Mb
![Docker images](screenshots/screenshot_image_size.png)
- There is a `user-defined bridge`
- The app container restarts after crashing
- Upon changes in the local `src` folder, the app launched in the docker container restarts
- The built image has been pushed to Docker Hub at https://hub.docker.com/repository/docker/mlatysheva/music_app_image/general

![Docker Hub](screenshots/screenshot_pushed_to_DockerHub.png)

- Migrations are used to create database entities
![Migration generate](screenshots/screenshot_migration_generate.png)
- The following scripts may be used to run migrations:
  - `npm run migration:generate` - to generate migrations
  - `npm run migration:run` - to run migrations
- Migrations are incoporated into the docker app when the app image is being built
- `npm run migration:generate` to generate migrations
- `npm run migration:run` to apply migrations to the database
