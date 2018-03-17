CREATE VIEW publish.f_daily_stats

AS

SELECT 
filedate AS record_date
,team
,name
,games AS games_played
,goals
,assists
,wins
,losses
,ot_losses
,saves
,allowed_goals
,shutouts
,shg_goals
,shg_assists
,gw_goals
,ot_goals
,shots
,hits
,blocks
,fo_wins
,fo_losses
,hgm_avg
,hgm_total
,replace(replace(hgm_value::text, '€'::text, ''::text), ' '::text, ''::text)::varchar(15) AS hgm_value
,goals * 6 + assists * 4 + shg_goals * 4 + shg_assists * 2 + gw_goals * 2 + ot_goals * 3 AS hgm_total_ga
,hgm_total - (goals * 6 + assists * 4 + shg_goals * 4 + shg_assists * 2 + gw_goals * 2 + ot_goals * 3) AS hgm_total_wo_ga
,CASE
	WHEN hgm_total > 0 THEN (goals * 6 + assists * 4 + shg_goals * 4 + shg_assists * 2 + gw_goals * 2 + ot_goals * 3)::double precision / hgm_total::double precision
	ELSE 0::double precision
END AS hgm_ga_percentage_total
,hgm_total - lag(hgm_total, 1) OVER (PARTITION BY name,team ORDER BY filedate) AS daily_points
,games - lag(games, 1) OVER (PARTITION BY name,team ORDER BY filedate) AS game_day
,to_date(filedate::character varying(10)::text, 'YYYYMMDD'::text) - to_date(lag(filedate, 10) OVER (PARTITION BY name ORDER BY filedate)::character varying(10)::text, 'YYYYMMDD'::text) AS last_10_period
,hgm_total - lag(hgm_total, 10) OVER (PARTITION BY name ORDER BY filedate) AS hgm_total_last_10_games
,(hgm_total - lag(hgm_total, 10) OVER (PARTITION BY name ORDER BY filedate))::numeric / 10.0 AS hgm_avg_last_10_games
,to_date(filedate::character varying(10)::text, 'YYYYMMDD'::text) - to_date(lag(filedate, 5) OVER (PARTITION BY name ORDER BY filedate)::character varying(10)::text, 'YYYYMMDD'::text) AS last_5_period
,hgm_total - lag(hgm_total, 5) OVER (PARTITION BY name ORDER BY filedate) AS hgm_total_last_5_games
,(hgm_total - lag(hgm_total, 5) OVER (PARTITION BY name ORDER BY filedate))::numeric / 5.0 AS hgm_avg_last_5_games
,to_date(filedate::character varying(10)::text, 'YYYYMMDD'::text) - to_date(lag(filedate, 3) OVER (PARTITION BY name ORDER BY filedate)::character varying(10)::text, 'YYYYMMDD'::text) AS last_3_period
,hgm_total - lag(hgm_total, 3) OVER (PARTITION BY name ORDER BY filedate) AS hgm_total_last_3_games
,(hgm_total - lag(hgm_total, 3) OVER (PARTITION BY name ORDER BY filedate))::numeric / 3.0 AS hgm_avg_last_3_games
,row_number() OVER (PARTITION BY name ORDER BY filedate DESC) AS latest

FROM staging.hockeygm_stats_all

WHERE filedate IS NOT NULL

