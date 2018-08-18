CREATE OR REPLACE VIEW publish.d_player_history AS
 WITH formatted_name AS (
         SELECT DISTINCT 
         	filedate,
         	latest_1.name AS original_name,
            char_length(latest_1.name::text) - char_length(replace(latest_1.name::text, ' '::text, ''::text)),
                CASE
                    WHEN (char_length(latest_1.name::text) - char_length(replace(latest_1.name::text, ' '::text, ''::text))) = 1 THEN (split_part(latest_1.name::text, ' '::text, 2) || ' '::text) || split_part(latest_1.name::text, ' '::text, 1)
                    WHEN (char_length(latest_1.name::text) - char_length(replace(latest_1.name::text, ' '::text, ''::text))) = 2 THEN (((split_part(latest_1.name::text, ' '::text, 3) || ' '::text) || split_part(latest_1.name::text, ' '::text, 1)) || ' '::text) || split_part(latest_1.name::text, ' '::text, 2)
                    WHEN (char_length(latest_1.name::text) - char_length(replace(latest_1.name::text, ' '::text, ''::text))) = 3 THEN (((((split_part(latest_1.name::text, ' '::text, 4) || ' '::text) || split_part(latest_1.name::text, ' '::text, 1)) || ' '::text) || split_part(latest_1.name::text, ' '::text, 2)) || ' '::text) || split_part(latest_1.name::text, ' '::text, 3)
                    ELSE NULL::text
                END AS formatted_name,
            latest_1.team
           FROM staging.hockeygm_stats_all latest_1
        )
        
 SELECT DISTINCT 
 	stats.filedate,
 	stats.name AS original_name,
    formatted_name.formatted_name,
    stats."position",
    replace(replace(stats.hgm_value::text, '€'::text, ''::text), ' '::text, ''::text) AS hgm_value,
    stats.team,
    pos.POSITION AS line_position
   FROM staging.hockeygm_stats_all stats
   
   INNER JOIN formatted_name 
   ON formatted_name.original_name::text = stats.name::text 
   	AND formatted_name.team::text = stats.team::text
    AND formatted_name.filedate = stats.filedate

   LEFT JOIN staging.stg_dfo_lines pos
   ON UPPER(formatted_name.formatted_name) = UPPER(pos.player)
   	AND REPLACE(LEFT(pos.file_date::text,10),'-','')::int = stats.filedate
   	AND pos.POSITION NOT LIKE 'PP%'
    