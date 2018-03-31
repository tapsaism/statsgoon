CREATE VIEW staging.dfo_latest_lines

AS

SELECT 
all_lines.file_date,
all_lines.position,
all_lines.player,
replace(substr(all_lines.file,strpos(all_lines.file,'_')+1,strpos(all_lines.file,'.')-strpos(all_lines.file,'_')-1),'-',' ') AS team
FROM staging.stg_dfo_lines all_lines

INNER JOIN (
	SELECT
	substr(file,10,30) file,
	MAX(file_date) file_date
	FROM staging.stg_dfo_lines
	GROUP BY substr(file,10,30)
	) latest_lines
ON substr(all_lines.file,10,30) = latest_lines.file
AND latest_lines.file_date = all_lines.file_date