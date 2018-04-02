CREATE MATERIALIZED VIEW api.daily_stats

AS

SELECT daily_stats.record_date AS filedate,
    player.formatted_name AS player,
    team.team,
    team.team_acronym,
    player."position",
    player.line_position,
    player.pp_position,
    daily_stats.hgm_avg AS points_avg,
    daily_stats.hgm_total AS points_total,
    daily_stats.hgm_value::integer AS player_value,
    daily_stats.daily_points AS points_daily,
    daily_stats.game_day AS game_played,
    season.season,
    now() AS refresh_date
   FROM publish.f_daily_stats daily_stats
     
   INNER JOIN publish.d_date_season season 
     ON daily_stats.record_date = season.date
     
   INNER JOIN publish.d_player player 
     ON player.original_name = daily_stats.name 
     AND player.team::text = daily_stats.team::text
   
   INNER JOIN publish.d_team team 
     ON team.team::text = daily_stats.team::text;