CREATE MATERIALIZED VIEW api.top_players_by_season

AS

SELECT 
	season,
	player.team,
	player.formatted_name AS name,
	player.position,
	hgm_total AS hockeygm_total,
	hgm_avg AS hockeygm_average, 
	player.hgm_value AS hockeygm_value,
	CASE WHEN hgm_total > 1 THEN player.hgm_value::int / hgm_total ELSE NULL END AS price_per_point,
	row_number() OVER (PARTITION BY season, position ORDER BY hgm_total DESC) AS rank,
	now() AS refresh_date
FROM publish.f_daily_stats stats

INNER JOIN publish.d_date_season season
	ON stats.record_date = season.date

INNER JOIN publish.d_player player
	ON player.original_name = stats.name
	
WHERE latest = 1

