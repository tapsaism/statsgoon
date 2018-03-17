create view publish.D_DATE_SEASON

AS

SELECT DISTINCT 
filedate as date,
CASE
	WHEN filedate >= 20161004 AND filedate <= 20170409 THEN '2016-2017'::text
	WHEN filedate >= 20170410 AND filedate <= 20170631 THEN '2016-2017 playoffs'::text
    WHEN filedate >= 20171004 and filedate <= 20180631 THEN '2017-2018'::text
	ELSE 'preseason'::text
END AS season
FROM staging.hockeygm_stats_all

where filedate IS NOT NULL;