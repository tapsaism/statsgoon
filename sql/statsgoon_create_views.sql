
*/

/** VIEWS **/

-- 1. V_PlayerStatsAll
	-- 1.2. V_PlayerStatsLatest
		-- 1.2.1 V_stats
	-- 1.3. V_PlayerStatsDaily
		-- 1.3.1 V_PlayerStatsLastGames
			-- 1.3.1.1 V_stats
				-- 1.3.1.1.1 getPlayerData()
	-- 1.4. V_PlayersAllGames


/** DROP VIEWS **/

--DROP FUNCTION getPlayerData();
--DROP VIEW V_stats;
--DROP VIEW V_PlayerStatsLastGames;
--DROP VIEW V_PlayerStatsLatest;
--DROP VIEW V_PlayerStatsDaily;
--DROP VIEW v_gamesperperiod;
--DROP VIEW V_PlayersAllGames;
--DROP VIEW V_PlayerStatsAll;

/** V_PlayerStatsAll **/

/** DESC: Combine goalie, dmen and forward stats **/

/** DEPENDENCIES: import tables **/

--DROP VIEW V_PlayerStatsAll

CREATE OR REPLACE VIEW V_PlayerStatsAll
AS
SELECT
*
FROM (

SELECT
filedate,
team,
'FWD' AS position,
CASE
	WHEN split_part(name, ' ' , 3) = '' THEN split_part(name, ' ' , 2) || ' ' || split_part(name, ' ' , 1)
	ELSE split_part(name, ' ' , 3) || ' ' || split_part(name, ' ' , 1) || ' ' || split_part(name, ' ' , 2)
END AS player,
games AS gamesPlayed,
hgm_avg,
hgm_total
,goals * 6
+ assists * 4
+ shg_goals * 4
+ shg_assists * 2
+ gw_goals * 2
+ ot_goals * 3 AS hgm_total_ga,
hgm_total - (goals * 6
+ assists * 4
+ shg_goals * 4
+ shg_assists * 2
+ gw_goals * 2
+ ot_goals * 3) AS hgm_total_wo_ga,
CASE
WHEN hgm_total > 0 THEN
	CAST((goals * 6
	+ assists * 4
	+ shg_goals * 4
	+ shg_assists * 2
	+ gw_goals * 2
	+ ot_goals * 3 ) AS FLOAT) / hgm_total
ELSE 0
END
AS hgm_ga_percentage_total,

REPLACE(REPLACE(hgm_value,'€',''),' ','') as hgm_value

FROM hockeygm_stats_f

UNION

SELECT
filedate,
team,
'DEF' AS position,
CASE
	WHEN split_part(name, ' ' , 3) = '' THEN split_part(name, ' ' , 2) || ' ' || split_part(name, ' ' , 1)
	ELSE split_part(name, ' ' , 3) || ' ' || split_part(name, ' ' , 1) || ' ' || split_part(name, ' ' , 2)
END AS player,
games,
hgm_avg,
hgm_total,
goals * 9
+ assists * 6
+ shg_goals * 4
+ shg_assists * 2
+ gw_goals * 2
+ ot_goals * 3 AS hgm_total_ga
,hgm_total - (goals * 9
+ assists * 6
+ shg_goals * 4
+ shg_assists * 2
+ gw_goals * 2
+ ot_goals * 3) AS hgm_total_wo_ga,
CASE
WHEN hgm_total > 0 THEN
	CAST((goals * 9
	+ assists * 6
	+ shg_goals * 4
	+ shg_assists * 2
	+ gw_goals * 2
	+ ot_goals * 3 ) AS FLOAT) / hgm_total
ELSE 0
END
AS hgm_ga_percentage_total,
REPLACE(REPLACE(hgm_value,'€',''),' ','') as hgm_value

FROM hockeygm_stats_d

UNION

SELECT
filedate,
team,
'GOA' AS position,
CASE
	WHEN split_part(name, ' ' , 3) = '' THEN split_part(name, ' ' , 2) || ' ' || split_part(name, ' ' , 1)
	ELSE split_part(name, ' ' , 3) || ' ' || split_part(name, ' ' , 1) || ' ' || split_part(name, ' ' , 2)
END AS player,
games AS gamesPlayed,
hgm_avg,
hgm_total,

goals * 25 + assists * 10 AS hgm_total_ga,
hgm_total - (goals * 25 + assists * 10) AS hgm_total_wo_ga,
CASE
WHEN hgm_total > 0 THEN
CAST((goals * 25 + assists * 10) AS FLOAT) / hgm_total
ELSE 0
END
AS hgm_ga_percentage_total,
REPLACE(REPLACE(hgm_value,'€',''),' ','') as hgm_value

FROM hockeygm_stats_g

) AS Skaters;

/** V_PlayerStatsLatest **/

/** DESC: Get the data from latest date **/

/** DEPENDENCIES: V_PlayerStatsAll **/

--DROP VIEW V_PlayerStatsLatest

CREATE OR REPLACE VIEW V_PlayerStatsLatest

AS

SELECT
*
FROM V_PlayerStatsAll
WHERE filedate = (
					SELECT
						MAX(filedate)
					FROM V_PlayerStatsAll
				);

/** v_gamesPerPeriod **/

/** DESC: Calculates the amount of games for each per hockey gm period **/

/** DEPENDENCIES: nhlScheduleGameDayIndex **/

--DROP VIEW v_gamesPerPeriod

CREATE OR REPLACE VIEW v_gamesPerPeriod
AS
SELECT
homeGames.hockeygmperiod,
homeGames.team,
homeGames.games + awayGames.games AS totalGames,
homeGames.games AS homeGames,
awayGames.games AS awayGames
FROM (

SELECT
hockeygmperiod,
hometeam AS team,
count(*) AS games
FROM nhlScheduleGameDayIndex

WHERE hockeygmperiod IS NOT NULL

GROUP BY hockeygmperiod, hometeam

) AS homeGames

INNER JOIN (

		SELECT
		hockeygmperiod,
		awayteam AS team,
		count(*) AS games
		FROM nhlScheduleGameDayIndex

		WHERE hockeygmperiod IS NOT NULL

		GROUP BY hockeygmperiod, awayteam

) AS awayGames
ON homeGames.team = awayGames.team
AND homeGames.hockeygmperiod = awayGames.hockeygmperiod;

/** V_PlayerStatsDaily **/

/** DESC: Daily stats for each player, daily points calculated from the difference of totals **/

/** DEPENDENCIES: V_PlayerStatsAll **/

--DROP VIEW V_PlayerStatsDaily

CREATE OR REPLACE VIEW V_PlayerStatsDaily

AS

SELECT
filedate,
team,
position,
player,
gamesplayed,
hgm_avg,
hgm_total,
hgm_value,
hgm_total - LAG(hgm_total,1) OVER(PARTITION BY player ORDER BY filedate) AS points,
gamesplayed - LAG(gamesplayed,1) OVER(PARTITION BY player ORDER BY filedate) AS game_played

FROM V_PlayerStatsAll

ORDER BY filedate;

/** V_PlayerStatsLastGames **/

/** DESC: Median and history calculations for players **/

/** DEPENDENCIES: V_PlayerStatsDaily **/

--DROP VIEW V_PlayerStatsLastGames

CREATE OR REPLACE VIEW V_PlayerStatsLastGames

AS

SELECT
filedate,
team,
position,
player,
game_played,
last_10_period,
hgm_total_last_10_games,
hgm_avg_last_10_games,
last_5_period,
hgm_total_last_5_games,
hgm_avg_last_5_games,
last_3_period,
hgm_total_last_3_games,
hgm_avg_last_3_games,
std_dev,
median

FROM (

	SELECT
	filedate,
	team,
	position,
	player,
	game_played,
	--LAST 10 GAMES
	TO_DATE(CAST(filedate AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(filedate, 10) OVER(PARTITION BY player ORDER BY filedate) AS varchar(10)), 'YYYYMMDD')
	 AS last_10_period,
	hgm_total - LAG(hgm_total, 10) OVER(PARTITION BY player ORDER BY filedate) AS hgm_total_last_10_games,
	(hgm_total - LAG(hgm_total, 10) OVER(PARTITION BY player ORDER BY filedate)) / 10.0 AS hgm_avg_last_10_games,
	--LAST 5 GAMES
	TO_DATE(CAST(filedate AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(filedate, 5) OVER(PARTITION BY player ORDER BY filedate) AS varchar(10)), 'YYYYMMDD')
	 AS last_5_period,
	hgm_total - LAG(hgm_total, 5) OVER(PARTITION BY player ORDER BY filedate) AS hgm_total_last_5_games,
	(hgm_total - LAG(hgm_total, 5) OVER(PARTITION BY player ORDER BY filedate)) / 5.0 AS hgm_avg_last_5_games,
	--LAST 3 GAMES
	TO_DATE(CAST(filedate AS varchar(10)), 'YYYYMMDD') - TO_DATE(CAST(LAG(filedate, 3) OVER(PARTITION BY player ORDER BY filedate) AS varchar(10)), 'YYYYMMDD')
	 AS last_3_period,
	hgm_total - LAG(hgm_total, 3) OVER(PARTITION BY player ORDER BY filedate) AS hgm_total_last_3_games,
	(hgm_total - LAG(hgm_total, 3) OVER(PARTITION BY player ORDER BY filedate)) / 3.0 AS hgm_avg_last_3_games,
	ROW_NUMBER() OVER (PARTITION BY player ORDER BY filedate DESC) AS latest,
	STDDEV(Points) OVER (PARTITION BY player) AS std_dev,
	MEDIAN(Points) OVER (PARTITION BY player) AS median

	FROM V_PlayerStatsDaily

	WHERE game_played = 1

) AS last_five_games

WHERE latest = 1
--AND last_10_period < 30
--AND last_5_period < 15
--AND last_3_period < 10

ORDER BY median desc;

/** V_stats **/

/** DESC: Joining the general stats to history and median **/

/** DEPENDENCIES: V_PlayerStatsLatest, V_PlayerStatsLastGames, getPlayerData() **/

--DROP VIEW V_stats

CREATE OR REPLACE VIEW V_stats

AS

SELECT
latestStats.filedate,
latestStats.team,
latestStats.position,
latestStats.gamesplayed,
latestStats.player as playerName,
latestStats.position || ' - ' || latestStats.player || ' - ' || latestStats.hgm_value as name,
1 AS player,
latestStats.hgm_value as value,
case when latestStats.position = 'FWD' then 1 when latestStats.position = 'DEF' then 0 when latestStats.position = 'GOA' then 0 end as forward,
case when latestStats.position = 'FWD' then 0 when latestStats.position = 'DEF' then 1 when latestStats.position = 'GOA' then 0 end as defence,
case when latestStats.position = 'FWD' then 0 when latestStats.position = 'DEF' then 0 when latestStats.position = 'GOA' then 1 end as goalie,
latestStats.hgm_avg as points_avg,
latestStats.hgm_total as points_total,
latestStats.hgm_total_ga as points_ga_only,
latestStats.hgm_total_wo_ga as points_wo_ga,
latestStats.hgm_ga_percentage_total as ga_percentage,
lastGame.last_10_period as last_10_days,
lastGame.hgm_total_last_10_games as last_10_total,
lastGame.hgm_avg_last_10_games as last_10_avg,
lastGame.last_5_period as last_5_days,
lastGame.hgm_total_last_5_games as last_5_total,
lastGame.hgm_avg_last_5_games as last_5_avg,
lastGame.last_3_period as last_3_days,
lastGame.hgm_total_last_3_games as last_3_total,
lastGame.hgm_avg_last_3_games as last_3_avg,
lastGame.std_dev,
lastGame.median

FROM V_PlayerStatsLatest latestStats

LEFT JOIN V_PlayerStatsLastGames lastGame
ON latestStats.team = lastGame.team
AND latestStats.player = lastGame.player
AND latestStats.position = lastGame.position;

/** getPlayerData() **/

/** DESC: getPlayerData() function was created to keep the amount SQL minimum in the JS code **/

/** DEPENDENCIES: V_PlayerStatsLatest, V_PlayerStatsLastGames, getPlayerData() **/

--DROP FUNCTION getPlayerData()

CREATE OR REPLACE FUNCTION getPlayerData()
RETURNS SETOF V_stats AS
$DELIMETER$

  SELECT * FROM V_stats

$DELIMETER$
LANGUAGE 'sql';

/** V_PlayersAllGames **/

/** DESC: All games for each players **/

/** DEPENDENCIES: V_playerStatsAll, nhlScheduleGameDayIndex **/

--DROP VIEW V_PlayersAllGames

CREATE OR REPLACE VIEW V_PlayersAllGames

AS

SELECT
*
FROM (
	--SELECT ALL PLAYERS
	select
	distinct
	player,
	team
	from V_playerStatsAll
	where player is not null
) AS players

--JOIN HOME GAMES TO PLAYERS
LEFT JOIN nhlScheduleGameDayIndex homeGames
ON homeGames.homeTeam = players.team

--UNION AWAY GAMES
UNION

SELECT
*
FROM (
	--SELECT ALL PLAYERS
	select
	distinct
	player,
	team
	from V_playerStatsAll
	where player is not null
) AS players

--JOIN AWAY GAMES TO PLAYERS
LEFT JOIN nhlScheduleGameDayIndex awayGames
ON awayGames.awayTeam = players.team;

SELECT COUNT(*) AS row_count, 'getPlayerData' AS view_name FROM getPlayerData()

UNION

SELECT COUNT(*) AS row_count, 'V_stats' AS view_name FROM V_stats

UNION

SELECT COUNT(*) AS row_count, 'V_PlayerStatsLastGames' AS view_name FROM V_PlayerStatsLastGames

UNION

SELECT COUNT(*) AS row_count, 'V_PlayerStatsLatest' AS view_name FROM V_PlayerStatsLatest

UNION

SELECT COUNT(*) AS row_count, 'V_PlayerStatsDaily' AS view_name FROM V_PlayerStatsDaily

UNION

SELECT COUNT(*) AS row_count, 'v_gamesperperiod' AS view_name FROM v_gamesperperiod

UNION

SELECT COUNT(*) AS row_count, 'V_PlayersAllGames' AS view_name FROM V_PlayersAllGames

UNION

SELECT COUNT(*) AS row_count, 'V_PlayerStatsAll' AS view_name FROM V_PlayerStatsAll;


-- 1. V_PlayerStatsAll
	-- 1.2. V_PlayerStatsLatest
		-- 1.2.1 V_stats
	-- 1.3. V_PlayerStatsDaily
		-- 1.3.1 v
			-- 1.3.1.1 V_stats
				-- 1.3.1.1.1 getPlayerData()
	-- 1.4. V_PlayersAllGames

/**

DROP FUNCTION getPlayerData();
DROP VIEW V_stats;
DROP VIEW V_PlayerStatsLastGames;
DROP VIEW V_PlayerStatsLatest;
DROP VIEW V_PlayerStatsDaily;
DROP VIEW v_gamesperperiod;
DROP VIEW V_PlayersAllGames;
DROP VIEW V_PlayerStatsAll;

**/
