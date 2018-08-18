CREATE OR REPLACE VIEW publish.f_goalie_nhl_stats

AS

SELECT 
game_date,
player,
player_id,
assists,
decision,
goals,
pen_min,
points,
save_pct,
saves,
shot_pct,
shots,
shots_against,
shutouts,
time_on_ice

FROM staging.hrf_stats_pivot 

--GOALIES DO NOT HAVE -+
WHERE plus_minus IS NULL
