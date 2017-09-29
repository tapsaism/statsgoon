'use strict'

let queries = {
  'player/all-stats':             `SELECT
                                  *
                                  FROM getPlayerData()
                                  WHERE player IS NOT NULL
                                  AND playername IN ($1:csv)`,

  'player/all-players':           `SELECT
                                  *
                                  FROM getPlayerData()
                                  ORDER BY position, playername`,

  'player/games-left':            `SELECT
                                   date,
                                   opponent_acrm,
                                   player,
                                   awaygame,
                                   homegame,
                                   game
                                   FROM v_teams_schedule_with_opponents_current_period games
                                   INNER JOIN All_Players player
                                   ON games.team = player.team
                                   WHERE player IN ($1:csv)`,

  'player/daily-stats':           `SELECT
                                  filedate,
                                  player,
                                  team,
                                  position,
                                  gamesplayed,
                                  hgm_avg as points_avg,
                                  hgm_total as points_total,
                                  hgm_value::integer as player_value,
                                  points as points_daily,
                                  game_played
                                  FROM V_PlayerStatsDaily WHERE player IN ($1:csv)
                                  ORDER BY filedate`,

  'team/games-left':              `SELECT
                                  team,
                                  SUM(game) games
                                  FROM V_PeriodGamesLeft
                                  GROUP BY team
                                  ORDER BY games DESC`,

  'team/schedule-current-period': `SELECT
                                   date,
                                   season,
                                   hockeygmperiod,
                                   team,
                                   team_acrm,
                                   awaygame,
                                   homegame,
                                   game,
                                   opponent,
                                   opponent_acrm,
                                   SUM(game) OVER (PARTITION BY team) as games_total
                                   FROM v_teams_schedule_with_opponents_current_period
                                   ORDER BY games_total DESC, team, date`
}

module.exports.getQueryByRequestType = (requestType) => {
  return queries[requestType]
}
