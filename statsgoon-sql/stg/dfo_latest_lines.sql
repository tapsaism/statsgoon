CREATE OR REPLACE VIEW staging.dfo_latest_lines

AS

WITH latest_lines AS (
	SELECT
		substr(file,10,30) file
		,MAX(file_date) file_date
	FROM staging.stg_dfo_lines
	GROUP BY substr(file,10,30)
)

SELECT 
	all_lines.file_date
	,all_lines.position
	,all_lines.player
	,CASE
		WHEN substr(all_lines.file,10,30) LIKE 'st-louis%' THEN 'st. louis'
		WHEN substr(all_lines.file,10,30) LIKE 'new-york-islanders%' THEN 'ny islanders'
		WHEN substr(all_lines.file,10,30) LIKE 'new-york-rangers%' THEN 'ny rangers'
		WHEN substr(all_lines.file,10,30) LIKE 'new-jersey%' THEN 'new jersey'
		WHEN substr(all_lines.file,10,30) LIKE 'tampa-bay%' THEN 'tampa bay'
		WHEN substr(all_lines.file,10,30) LIKE 'los-angeles%' THEN 'los angeles'
		WHEN substr(all_lines.file,10,30) LIKE 'san-jose%' THEN 'san jose'
		ELSE substr(all_lines.file,10,strpos(all_lines.file,'-')-10)
	END AS team
FROM staging.stg_dfo_lines all_lines

INNER JOIN latest_lines
ON substr(all_lines.file,10,30) = latest_lines.file
	AND latest_lines.file_date = all_lines.file_date;
