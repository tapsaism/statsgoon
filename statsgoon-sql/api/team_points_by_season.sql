CREATE MATERIALIZED VIEW api.team_points_by_season

AS

SELECT 
	season,
	stats.team,
	player.position,
	SUM(hgm_total) AS hockeygm_total,
	CAST(AVG(CAST(hgm_avg AS DECIMAL)) AS INT) AS hockeygm_average,
    CAST(AVG(CAST(player.hgm_value AS INT)) AS INT) AS hockeygm_value,
    now() AS refresh_date 
FROM publish.f_daily_stats stats

INNER JOIN publish.d_date_season season
	ON stats.record_date = season.date

INNER JOIN publish.d_player player
	ON player.original_name = stats.name
	
WHERE latest = 1

GROUP BY season, stats.team, player.position

ORDER BY hockeygm_total


