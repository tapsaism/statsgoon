CREATE OR REPLACE VIEW monitor.inserts

AS

SELECT to_timestamp(file_date::character varying::text, 'YYYYMMDD HH:MM:SSS'::text)::timestamp without time zone AS "time",
    name,
    'stg_hgm_goalies'::text AS "table",
    1 AS count
   FROM staging.stg_hgm_goalies
UNION ALL
 SELECT to_timestamp(file_date::character varying::text, 'YYYYMMDD'::text)::timestamp without time zone AS "time",
    name,
    'stg_hgm_dmen'::text AS "table",
    1 AS count
   FROM staging.stg_hgm_dmen
UNION ALL
 SELECT to_timestamp(file_date::character varying::text, 'YYYYMMDD'::text)::timestamp without time zone AS "time",
    name,
    'stg_hgm_forwards'::text AS "table",
    1 AS count
   FROM staging.stg_hgm_forwards
UNION ALL
SELECT 
	LEFT(file_date::varchar, 10)::timestamp AS "time",
    'player' AS "name",
    'stg_dfo_lines'::text AS "table",
    1 AS count
FROM staging.stg_dfo_lines
UNION ALL
SELECT 
	insert_date::timestamp without time zone AS "time",
    'title' AS "name",
    'stg_hrf_stats'::text AS "table",
    count(*) / count(DISTINCT title) AS count
FROM staging.stg_hrf_stats
GROUP BY "time","name","table"






