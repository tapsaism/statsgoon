const promise = require('bluebird')
const dotenv = require('dotenv').config()

const pgp = require('pg-promise')({
  promiseLib: promise
});


module.exports = pgp(process.env.PGCONNSTR)
