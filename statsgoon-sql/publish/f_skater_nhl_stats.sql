CREATE OR REPLACE VIEW publish.f_skater_nhl_stats

AS

SELECT 
game_date,
player,
player_id,
assists,
assists_ev,
assists_pp,
assists_sh,
goals,
goals_ev,
goals_gw,
goals_pp,
goals_sh,
pen_min,
plus_minus,
points,
shifts,
shot_pct,
shots,
time_on_ice

FROM staging.hrf_stats_pivot 

--GOALIES DO NOT HAVE -+
WHERE plus_minus IS NULL
