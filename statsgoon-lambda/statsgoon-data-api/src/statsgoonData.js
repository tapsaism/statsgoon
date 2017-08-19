'use strict'
const queries = require('./db/querySolver')
const db = require('./db/db.js')

module.exports.getData = (filter, requestType) => {

  let filters = []
  filters.push(filter);

  let query = queries.getQueryByRequestType(requestType)

  console.info(query)

  return db.query(query, filters)
}
