'use strict'

let queries = {
  'player/all-stats':          `SELECT
                                *
                                FROM getPlayerData()
                                WHERE player IS NOT NULL
                                AND playername IN ($1:csv)`,

  'player/all-players':        `SELECT
                                *
                                FROM getPlayerData()
                                ORDER BY position, playername`,

  'player/games-left':         `SELECT
                                gamedaydate,
                                COUNT(*)
                                FROM V_PlayersAllGames
                                WHERE player IN ($1:csv)
                                AND gamedaydate >= current_date
                                GROUP BY gamedaydate
                                ORDER BY gamedaydate`,

  'player/daily-stats':        `SELECT
                                filedate,
                                player,
                                team,
                                position,
                                gamesplayed,
                                hgm_avg as points_avg,
                                hgm_total as points_total,
                                hgm_value as value,
                                points as points_daily,
                                game_played
                                FROM V_PlayerStatsDaily WHERE player IN ($1:csv)
                                ORDER BY filedate`,

  'team/games-left':           `SELECT
                                team,
                                SUM(game) games
                                FROM V_PeriodGamesLeft
                                GROUP BY team`
}

module.exports.getQueryByRequestType = (requestType) => {
  return queries[requestType]
}
