-------------------------

CREATE OR REPLACE VIEW F_PLAYER_DAILY_STATS

AS

SELECT
filedate AS RECORD_DATE,
team AS TEAM,
player AS PLAYER,
gamesplayed AS GAMES_PLAYED,
hgm_avg AS HOCKEYGM_AVERAGE,
hgm_total AS HOCKEYGM_TOTAL,
hgm_value AS HOCKEYGM_VALUE,
hgm_total - LAG(hgm_total,1) OVER(PARTITION BY player ORDER BY filedate) AS DAILY_POINTS,
gamesplayed - LAG(gamesplayed,1) OVER(PARTITION BY player ORDER BY filedate) AS GAME_DAY

FROM V_PlayerStatsAll

ORDER BY filedate;

--------------------------

CREATE OR REPLACE VIEW F_PLAYER_LATEST_GAMES_SEASONAL

AS

SELECT
PLAYER_LATEST_DATE_SEASONAL.SEASON,
STATS.FILEDATE AS RECORD_DATE,
STATS.TEAM,
PLAYER.NAME,
PLAYER.POSITION,
STATS.HGM_TOTAL AS HOCKEYGM_TOTAL,
STATS.HGM_AVG AS HOCKEYGM_AVERAGE,
PLAYER.PLAYER_LATEST_VALUE AS HOCKEYGM_VALUE,
STATS.HGM_TOTAL_GA AS HOCKEYGM_TOTAL_GA,
STATS.HGM_TOTAL_WO_GA AS HOCKEYGM_TOTAL_WO_GA,
STATS.HGM_GA_PERCENTAGE_TOTAL AS HOCKEYGM_GA_PERCENTAGE
,
CASE
	WHEN STATS.HGM_TOTAL > 0 THEN PLAYER.PLAYER_LATEST_VALUE::integer / STATS.HGM_TOTAL
	ELSE 0
END AS PRICE_PER_POINT

FROM V_PlayerStatsAll STATS

INNER JOIN D_PLAYER PLAYER
ON PLAYER.NAME = STATS.PLAYER

INNER JOIN (
			SELECT
			PLAYER,
			SEASON,
			MAX(FILEDATE) AS LATEST_DATE
			FROM V_PlayerStatsAll STATS

			INNER JOIN D_DATE_SEASON SEASON
			ON SEASON.DATE = STATS.FILEDATE

			GROUP BY PLAYER,SEASON
			) PLAYER_LATEST_DATE_SEASONAL
ON PLAYER_LATEST_DATE_SEASONAL.PLAYER = STATS.PLAYER
AND PLAYER_LATEST_DATE_SEASONAL.LATEST_DATE = STATS.FILEDATE;

-----------------------

CREATE OR REPLACE VIEW F_PLAYER_HISTORY

AS;

SELECT
SEASON.SEASON,
FILEDATE AS RECORD_DATE,
TEAM,
PLAYER,
GAME_DAY,
--LAST 10 GAMES
TO_DATE(CAST(FILEDATE AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(FILEDATE, 10) OVER(PARTITION BY player ORDER BY FILEDATE) AS varchar(10)), 'YYYYMMDD')
AS last_10_period,
HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 10) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE) AS hgm_total_last_10_games,
(HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 10) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE)) / 10.0 AS hgm_avg_last_10_games,
--LAST 5 GAMES
TO_DATE(CAST(RECORD_DATE AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(RECORD_DATE, 5) OVER(PARTITION BY player ORDER BY RECORD_DATE) AS varchar(10)), 'YYYYMMDD')AS last_5_period,
HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 5) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE) AS hgm_total_last_5_games,
(HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 5) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE)) / 5.0 AS hgm_avg_last_5_games,
--LAST 3 GAMES
TO_DATE(CAST(RECORD_DATE AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(RECORD_DATE, 3) OVER(PARTITION BY player ORDER BY RECORD_DATE) AS varchar(10)), 'YYYYMMDD') AS last_3_period,
HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 3) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE) AS hgm_total_last_3_games,
(HOCKEYGM_TOTAL - LAG(HOCKEYGM_TOTAL, 3) OVER(PARTITION BY PLAYER ORDER BY RECORD_DATE)) / 3.0 AS hgm_avg_last_3_games,
ROW_NUMBER() OVER (PARTITION BY PLAYER ORDER BY RECORD_DATE DESC) AS latest,
STDDEV(DAILY_POINTS) OVER (PARTITION BY PLAYER) AS std_dev,
MEDIAN(DAILY_POINTS) OVER (PARTITION BY PLAYER) AS median

FROM V_PlayerStatsAll STATS

INNER JOIN D_DATE_SEASON SEASON
ON STATS.RECORD_DATE = SEASON.DATE

WHERE GAME_DAY = 1;
