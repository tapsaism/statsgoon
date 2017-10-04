'use strict'
const queries = require('./db/querySolver')
const db = require('./db/db.js')

module.exports.getData = (filter, requestType) => {

  console.log(filter)

  let query = queries.getQueryByRequestType(requestType)
  console.info(query)

  return db.query(query, filter)
}
