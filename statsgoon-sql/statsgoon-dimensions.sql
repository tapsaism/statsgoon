CREATE OR REPLACE VIEW D_PLAYER

AS

SELECT DISTINCT
PLAYER.PLAYER AS NAME,
POSITION,
LATEST_VALUE.hgm_value AS PLAYER_LATEST_VALUE,
LATEST_VALUE.TEAM
FROM v_playerstatsall PLAYER

LEFT JOIN (select
			player,
			team,
			hgm_value
			from v_playerstatsall
				where filedate = (select max(filedate) from v_playerstatsall)) LATEST_VALUE
ON PLAYER.player = LATEST_VALUE.player

WHERE PLAYER.player is not null
AND LATEST_VALUE.TEAM IS NOT NULL;

---------------------

CREATE OR REPLACE VIEW D_DATE_SEASON

AS

SELECT DISTINCT filedate AS DATE,
CASE
	WHEN filedate between 20161004 AND 20170631 THEN '2016-2017'
	WHEN filedate between 20171004 AND 20180631 THEN '2017-2018'
	ELSE 'preseason'
END AS SEASON
FROM V_PlayerStatsAll
WHERE filedate is not null;

-----------------------
CREATE OR REPLACE VIEW D_TEAM

AS

SELECT DISTINCT
TEAM,
CASE
	WHEN TEAM = 'Anaheim' THEN 'ANA'
	WHEN TEAM = 'Arizona' THEN 'ARI'
	WHEN TEAM = 'Boston' THEN 'BOS'
	WHEN TEAM = 'Buffalo' THEN 'BUF'
	WHEN TEAM = 'Carolina' THEN 'CAR'
	WHEN TEAM = 'Calgary' THEN 'CGY'
	WHEN TEAM = 'Chicago' THEN 'CHI'
	WHEN TEAM = 'Columbus' THEN 'CJB'
	WHEN TEAM = 'Colorado' THEN 'COL'
	WHEN TEAM = 'Dallas' THEN 'DAL'
	WHEN TEAM = 'Detroit' THEN 'DET'
	WHEN TEAM = 'Edmonton' THEN 'EDM'
	WHEN TEAM = 'Florida' THEN 'FLA'
	WHEN TEAM = 'Los Angeles' THEN 'LAK'
	WHEN TEAM = 'Minnesota' THEN 'MIN'
	WHEN TEAM = 'Montreal' THEN 'MON'
	WHEN TEAM = 'Nashville' THEN 'NAS'
	WHEN TEAM = 'New Jersey' THEN 'NJD'
	WHEN TEAM = 'NY Islanders' THEN 'NYI'
	WHEN TEAM = 'NY Rangers' THEN 'NYR'
	WHEN TEAM = 'Ottawa' THEN 'OTT'
	WHEN TEAM = 'Philadelphia' THEN 'PHI'
	WHEN TEAM = 'Pittsburgh' THEN 'PIT'
	WHEN TEAM = 'San Jose' THEN 'SJS'
	WHEN TEAM = 'St. Louis' THEN 'STL'
	WHEN TEAM = 'Tampa Bay' THEN 'TBL'
	WHEN TEAM = 'Toronto' THEN 'TOR'
	WHEN TEAM = 'Vancouver' THEN 'VAN'
	WHEN TEAM = 'Vegas' THEN 'VGK'
	WHEN TEAM = 'Washington' THEN 'WSH'
	WHEN TEAM = 'Winnipeg' THEN 'WPG'
END TEAM_ACRONYM
FROM V_PlayerStatsAll
WHERE TEAM IS NOT NULL;
