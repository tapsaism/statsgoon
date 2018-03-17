CREATE MATERIALIZED VIEW api.solver_data

AS

 WITH last_record_and_median_by_season AS (
 	SELECT 
 		name,
 		team,
 		season,
 		MAX(record_date) AS record_date,
 		MEDIAN(daily_points) AS Median
 		FROM publish.f_daily_stats stats
 		
 		INNER JOIN publish.d_date_season season
   		ON season."date" = stats.record_date
 		
   		WHERE game_day = 1
   		
 		GROUP BY name,team,season
 )

 SELECT 
   latest.season,
   stats.record_date AS filedate,
   team.team,
   team.team_acronym,
   player."position",
   player.formatted_name AS playername,
   (((player."position" || ' - '::text) || player.formatted_name) || ' - '::text) || player.hgm_value AS name,
    1 AS player,
    player.hgm_value AS value,
    CASE
            WHEN player."position" = 'FWD'::text THEN 1
            WHEN player."position" = 'DEF'::text THEN 0
            WHEN player."position" = 'GOA'::text THEN 0
            ELSE NULL::integer
        END AS forward,
        CASE
            WHEN player."position" = 'FWD'::text THEN 0
            WHEN player."position" = 'DEF'::text THEN 1
            WHEN player."position" = 'GOA'::text THEN 0
            ELSE NULL::integer
        END AS defence,
        CASE
            WHEN player."position" = 'FWD'::text THEN 0
            WHEN player."position" = 'DEF'::text THEN 0
            WHEN player."position" = 'GOA'::text THEN 1
            ELSE NULL::integer
        END AS goalie,
    hgm_avg AS points_avg,
    hgm_total AS points_total,
    hgm_total_ga AS points_ga_only,
    hgm_total_wo_ga AS points_wo_ga,
    CASE WHEN hgm_total_ga > 0 THEN hgm_total_ga::float / hgm_total::float ELSE 0.0 END AS ga_percentage,
    CASE WHEN hgm_total > 0 THEN player.hgm_value::int / hgm_total ELSE 0.0 END AS price_per_point,
    last_10_period AS last_10_days,
    hgm_total_last_10_games AS last_10_total,
    hgm_avg_last_10_games AS last_10_avg,
    last_5_period AS last_5_days,
    hgm_total_last_5_games AS last_5_total,
    hgm_avg_last_5_games AS last_5_avg,
    last_3_period AS last_3_days,
    hgm_total_last_3_games AS last_3_total,
    hgm_avg_last_3_games AS last_3_avg,
    median,
    now() AS refresh_date
    
    FROM publish.f_daily_stats stats
   
   	INNER JOIN publish.d_player player
   		ON player.original_name = stats.name
   		AND player.team = stats.team
   	
   	INNER JOIN publish.d_team team
   		ON stats.team = team.team
   
   	INNER JOIN last_record_and_median_by_season latest
   		ON stats.name = latest.name
   		AND stats.team = latest.team
   		AND stats.record_date = latest.record_date
   	
   		
   	
