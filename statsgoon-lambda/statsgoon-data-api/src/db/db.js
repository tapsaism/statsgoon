const promise = require('bluebird')

const pgp = require('pg-promise')({
  promiseLib: promise //override the pgp default ES6 promise with bluebird
});

const cn = process.env.DB_CONN_STR
const db = pgp(cn);

module.exports = db;
