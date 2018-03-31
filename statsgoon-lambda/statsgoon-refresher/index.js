'use strict'

const db = require('./src/db/db.js')

exports.statsgoonRefresher = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false

  console.info('Starting to refresh views')

  db.task('update views', t => {
   return t.batch([
     t.any('REFRESH MATERIALIZED VIEW api.daily_stats'),
     t.any('REFRESH MATERIALIZED VIEW api.schedule_current_period'),
     t.any('REFRESH MATERIALIZED VIEW api.schedule_current_period_player'),
     t.any('REFRESH MATERIALIZED VIEW api.solver_data'),
     t.any('REFRESH MATERIALIZED VIEW api.team_games_left'),
     t.any('REFRESH MATERIALIZED VIEW api.team_points_by_season'),
     t.any('REFRESH MATERIALIZED VIEW api.top_players_by_season')
         ])
   })
   .then(data => {
     console.info('View refresh success!')
   })
    .catch(error => {
     console.info('View refresh failed: ' + error)
  })

}
