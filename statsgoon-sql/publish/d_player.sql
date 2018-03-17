CREATE OR REPLACE VIEW publish.d_player

AS

SELECT distinct
name as original_name,
CASE
                    WHEN split_part(name::text, ' '::text, 3) = ''::text THEN (split_part(name::text, ' '::text, 2) || ' '::text) || split_part(name::text, ' '::text, 1)
                    ELSE (((split_part(name::text, ' '::text, 3) || ' '::text) || split_part(name::text, ' '::text, 1)) || ' '::text) || split_part(name::text, ' '::text, 2)
                END AS formatted_name,
position,
replace(replace(hgm_value::text, '€'::text, ''::text), ' '::text, ''::text) AS hgm_value,
team
FROM staging.hockeygm_stats_latest;