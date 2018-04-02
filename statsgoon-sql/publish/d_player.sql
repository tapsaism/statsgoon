CREATE OR REPLACE VIEW publish.d_player

AS

WITH formatted_name
AS (
SELECT DISTINCT
	name AS original_name
	,char_length(name) - char_length(replace(name,' ',''))
	,CASE 
		WHEN char_length(name) - char_length(replace(name,' ','')) = 1 THEN split_part(latest.name::text, ' '::text, 2) || ' '::text || split_part(latest.name::text, ' '::text, 1)
		WHEN char_length(name) - char_length(replace(name,' ','')) = 2 THEN split_part(latest.name::text, ' '::text, 3) || ' '::text || split_part(latest.name::text, ' '::text, 1) || ' '::text || split_part(latest.name::text, ' '::text, 2)
		WHEN char_length(name) - char_length(replace(name,' ','')) = 3 THEN split_part(latest.name::text, ' '::text, 4) || ' '::text || split_part(latest.name::text, ' '::text, 1) || ' '::text || split_part(latest.name::text, ' '::text, 2) || ' '::text || split_part(latest.name::text, ' '::text, 3)
	END AS formatted_name
	,team
FROM staging.hockeygm_stats_latest latest
),

pp_unit AS (
SELECT 
	player
	,team
	,position
	,RIGHT(position,1) AS pp_unit
	,ROW_NUMBER() OVER (PARTITION BY player ORDER BY RIGHT(POSITION,1)) main_unit
FROM staging.dfo_latest_lines 
WHERE POSITION LIKE 'PP%'
)


SELECT DISTINCT
	latest.name as original_name
	,formatted_name.formatted_name
	,latest.position
	,replace(replace(latest.hgm_value::text, '€'::text, ''::text), ' '::text, ''::text) AS hgm_value
	,latest.team
	,line_pos.POSITION line_position
	,pp_pos.POSITION pp_position
	,RIGHT(line_pos.POSITION,1) AS line
	,CASE WHEN pp_pos.POSITION IS NOT NULL THEN 1 ELSE 0 END AS plays_pp
	,RIGHT(pp_pos.POSITION,1) AS pp_unit

FROM staging.hockeygm_stats_latest latest

INNER JOIN formatted_name
ON formatted_name.original_name = latest.name
	AND formatted_name.team = latest.team

LEFT JOIN staging.dfo_latest_lines line_pos
ON UPPER(line_pos.player) = UPPER(formatted_name.formatted_name)
	AND UPPER(line_pos.team) = UPPER(latest.team)
	AND line_pos.POSITION NOT LIKE 'PP%'

LEFT JOIN pp_unit pp_pos
ON UPPER(pp_pos.player) = UPPER(formatted_name.formatted_name) 
	AND UPPER(pp_pos.team) = UPPER(latest.team)
	AND main_unit = 1











