## Routes

- Admin route
- User route
- Class route
- Timetable route

## Tech

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Sequelize](https://sequelize.org/) - promise-based Node.js ORM tool for Postgres, MySQL, MariaDB, SQLite, DB2 and Microsoft SQL Server
- [Jest](https://jestjs.io/) - a delightful JavaScript Testing Framework with a focus on simplicity.
- [Mysql](https://www.mysql.com/) - an open-source relational database management system
- [Cloudinary](https://cloudinary.com/) - cloud server for store images



## Installation

Requires [Node.js](https://nodejs.org/) v10+ to run.
Requires [Mysql](https://www.mysql.com/) to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i
```
- create .env file same as .env.example
- put your information in it

Create database and migrate table

```sh
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```
Create Admin account

```sh
npx sequelize-cli db:seed:all
```

Start server

```sh
npm start
```
Or

```sh
npm run dev
```

Testing

- Setup and create data for testing database

```sh
npm run db:reset

```
- Start testing
```sh
npm test
```

## License

MIT
