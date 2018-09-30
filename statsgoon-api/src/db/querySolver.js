'use strict'

const squel = require("squel");

let queries = {
  '/player/all-stats':             squel.select().from('api.solver_data')
                                  .where('playername IN ($1:csv)')
                                  .where('season = $2')
                                  .toString(),

  '/player/all-players':           squel.select().from('api.all_players').toString(),

  '/player/games-left':            squel.select().from('api.schedule_current_period_player')
                                  .where('player IN ($1:csv)')
                                  .order('date')
                                  .toString(),

  '/player/daily-stats':           squel.select().from('api.daily_stats')
                                  .where('player IN ($1:csv)')
                                  .where('season = $2')
                                  .order('filedate')
                                  .toString(),

  '/player/top-players':           squel.select().from('api.top_players_by_season')
                                  .where('season = $1')
                                  .where('position IN ($2:csv)')
                                  .where('team IN ($3:csv)')
                                  .order('hockeygm_total', false)
                                  .limit(10)
                                  .toString(),

  '/team/games-left':              squel.select().from('api.team_games_left').toString(),

  '/team/schedule-current-period': squel.select().from('api.schedule_current_period')
                                  .field('*')
                                  .field('SUM(game) OVER (PARTITION BY team) as games_total')
                                  .field('SUM(homegame) OVER (PARTITION BY team) as home_games_total')
                                  .field('SUM(awaygame) OVER (PARTITION BY team) as away_games_total')
                                  .order('games_total', false)
                                  .order('team')
                                  .order('date')
                                  .toString(),

  '/team/schedule-with-params':    squel.select().from('api.schedule')
                                  .field('*')
                                  .field('SUM(game) OVER (PARTITION BY team) as games_total')
                                  .field('SUM(homegame) OVER (PARTITION BY team) as home_games_total')
                                  .field('SUM(awaygame) OVER (PARTITION BY team) as away_games_total')
                                  .where('date BETWEEN $1 and $2')
                                  .order('games_total', false)
                                  .order('team')
                                  .order('date')
                                  .toString(),

  '/team/points':                  squel.select().from('api.team_points_by_season')
                                  .field('season')
                                  .field('team')
                                  .field('SUM(hockeygm_total) AS hockeygm_total')
                                  .field('ROUND(AVG(hockeygm_average)::numeric, 2) AS hockeygm_average')
                                  .field('AVG(hockeygm_value)::int AS hockeygm_value')
                                  .group('season')
                                  .group('team')
                                  .where('season = $1')
                                  .where('position IN ($2:csv)')
                                  .order('hockeygm_total', false)
                                  .toString(),

  '/team/nn':                      squel.select().from('api.neural_network_data')
                                  .toString(),

  '/team/forrest':                 squel.select().from('api.forrest_data')
                                  .toString(),

  '/solver':                       squel.select().from('api.solver_data')
                                   .where('team IN ($1:csv)')
                                   .where('season = $2')
                                   .where('playername NOT IN ($3:csv)')
                                   .where('value is not null')
                                   .where('player is not null')
                                   .toString()
}

module.exports.getQueryByRequestType = (requestType) => {
  return queries[requestType]
}
