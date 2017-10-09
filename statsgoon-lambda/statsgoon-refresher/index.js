'use strict'

const db = require('./src/db/db.js')

exports.statsgoonRefresher = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false

  console.info('Starting to refresh views')

  db.task('update views', t => {
   return t.batch([
           t.any('REFRESH MATERIALIZED VIEW F_SOLVER_DATA'),
           t.any('REFRESH MATERIALIZED VIEW F_DAILY_STATS')
         ])
   })
   .then(data => {
     console.info('View refresh success!')
   })
    .catch(error => {
     console.info('View refresh failed: ' + error)
  })

}
