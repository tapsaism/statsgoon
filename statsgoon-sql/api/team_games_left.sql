CREATE MATERIALIZED VIEW api.team_games_left

AS

WITH current_period AS (
         SELECT d_hockeygm_period.season,
            d_hockeygm_period.hockeygmperiod
           FROM publish.d_hockeygm_period
          WHERE d_hockeygm_period.startdate <= 'now'::text::date AND d_hockeygm_period.enddate >= 'now'::text::date OR d_hockeygm_period.startdate >= 'now'::text::date AND d_hockeygm_period.enddate >= 'now'::text::date
          ORDER BY d_hockeygm_period.season, d_hockeygm_period.hockeygmperiod
         LIMIT 1
        )
 SELECT 
    sched.team,
    SUM(sched.awaygame) AWAY_GAMES,
    SUM(sched.homegame) HOME_GAMES,
    SUM(sched.game) GAMES
   FROM api.schedule sched
   JOIN current_period period 
   	ON period.season = sched.season 
   	AND period.hockeygmperiod = sched.hockeygmperiod
  WHERE sched.date >= 'now'::text::date
  
  GROUP BY team
  ORDER BY GAMES DESC, team
