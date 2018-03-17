CREATE MATERIALIZED VIEW api.schedule_current_period_player

AS

WITH current_period AS (
	SELECT 
		season, 
		hockeygmperiod 
	FROM publish.d_hockeygm_period
	
	WHERE 
   		(startdate <= 'now'::text::date AND enddate >= 'now'::text::date)
   		OR
   		(startdate >= 'now'::text::date AND enddate >= 'now'::text::date)
   	ORDER BY season, hockeygmperiod
   	LIMIT 1
)    
   
   SELECT date,
    sched.season,
    sched.hockeygmperiod,
    sched.team,
    sched.team_acrm,
    sched.awaygame,
    sched.homegame,
    sched.game,
    sched.opponent,
    sched.opponent_acrm,
    player.formatted_name AS player,
    player.POSITION AS POSITION,
    now() AS refresh_date 
   FROM api.schedule sched
   
   INNER JOIN publish.d_player player
   		ON player.team = sched.team
   
   INNER JOIN current_period period
   		ON period.season = sched.season
   		AND period.hockeygmperiod = sched.hockeygmperiod

   	WHERE date >= 'now'::text::date