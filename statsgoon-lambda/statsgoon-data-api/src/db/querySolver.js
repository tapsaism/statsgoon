'use strict'

let queries = {
  'player/all-stats':              `SELECT
                                    *
                                    FROM solver_data()
                                    WHERE player IS NOT NULL
                                    AND playername IN ($1:csv)
                                    AND season = $2`,

  'player/all-players':            `SELECT
                                    *
                                    FROM D_PLAYER`,

  'player/games-left':             `SELECT
                                    DATE,
                                    OPPONENT_ACRM,
                                    PLAYER,
                                    AWAYGAME,
                                    HOMEGAME,
                                    GAME
                                    FROM v_teams_schedule_with_opponents_current_period games
                                    INNER JOIN All_Players player
                                    ON games.team = player.team
                                    WHERE player IN ($1:csv)
                                    ORDER BY DATE`,

  'player/daily-stats':            `SELECT
                                  	*
                                    FROM daily_stats()
                                    WHERE player IN ($1:csv)
                                    AND SEASON = $2
                                    ORDER BY filedate`,

  'player/top-players':            `SELECT
                                    SEASON,
                                    TEAM,
                                    NAME,
                                    POSITION,
                                    HOCKEYGM_TOTAL,
                                    HOCKEYGM_AVERAGE,
                                    HOCKEYGM_VALUE,
                                    PRICE_PER_POINT
                                    FROM F_TOP_PLAYERS_BY_SEASON

                                    WHERE SEASON = $1
                                    AND POSITION IN ($2:csv)
                                    AND TEAM IN ($3:csv)

                                    ORDER BY hockeygm_total DESC

                                    LIMIT 10`,

  'team/games-left':               `SELECT
                                    team,
                                    SUM(game) games
                                    FROM V_PeriodGamesLeft
                                    GROUP BY team
                                    ORDER BY games DESC`,

  'team/schedule-current-period':  `SELECT
                                    DATE,
                                    SEASON,
                                    HOCKEYGMPERIOD,
                                    TEAM,
                                    TEAM_ACRM,
                                    AWAYGAME,
                                    HOMEGAME,
                                    GAME,
                                    OPPONENT,
                                    OPPONENT_ACRM,
                                    SUM(GAME) OVER (PARTITION BY TEAM) AS GAMES_TOTAL
                                    FROM v_teams_schedule_with_opponents_current_period
                                    ORDER BY games_total DESC, team, date`,

  'team/schedule-with-params':     `SELECT
                                    DATE,
                                    SEASON,
                                    HOCKEYGMPERIOD,
                                    TEAM,
                                    TEAM_ACRM,
                                    AWAYGAME,
                                    HOMEGAME,
                                    GAME,
                                    OPPONENT,
                                    OPPONENT_ACRM,
                                    SUM(game) OVER (PARTITION BY team) as games_total
                                    FROM v_teams_schedule_with_opponents
                                    WHERE date between $1 and $2
                                    ORDER BY games_total DESC, team, date`,

    'team/points':                  `SELECT
                                     SEASON,
                                     TEAM,
                                     SUM(hockeygm_total)::integer HOCKEYGM_TOTAL,
                                     CAST(AVG(CAST(hockeygm_average AS DECIMAL)) AS INT) HOCKEYGM_AVERAGE,
                                     CAST(AVG(CAST(hockeygm_value AS INT)) AS INT) HOCKEYGM_VALUE

                                     FROM F_TOP_PLAYERS_BY_SEASON

                                     WHERE SEASON = $1
                                     AND POSITION IN ($2:csv)

                                     GROUP BY SEASON,TEAM

                                     ORDER BY 3 DESC`
}

module.exports.getQueryByRequestType = (requestType) => {
  return queries[requestType]
}
