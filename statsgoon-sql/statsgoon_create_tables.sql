
/** PHYSICAL TABLES **/

/** CREATE SCHEDULE **/

--DROP TABLE nhlSchedule

CREATE TABLE nhlSchedule
(
gameDayDate date,
gameDesc varchar(100),
homeTeam varchar(50),
awayTeam varchar(50)
)


--DROP TABLE nhlScheduleGameDayIndex

CREATE TABLE nhlScheduleGameDayIndex
AS
select
gamedaydate,
gamedesc,
hometeam,
awayteam,
dense_rank() over(ORDER BY gamedaydate) + 3 as GameDayIndex,
CASE
	WHEN gamedaydate between '2016-10-12' AND '2016-11-13' THEN 1
	WHEN gamedaydate between '2016-11-17' AND '2016-12-11' THEN 2
	WHEN gamedaydate between '2016-12-15' AND '2017-01-26' THEN 3
	WHEN gamedaydate between '2017-01-31' AND '2017-03-05' THEN 4
	WHEN gamedaydate between '2016-03-09' AND '2016-04-09' THEN 5
END AS HockeyGMPeriod

from nhlSchedule

ORDER BY 1


/** CREATE IMPORT TABLES **/



--DROP TABLE hockeygm_stats_f

CREATE TABLE hockeygm_stats_f
(
	insertdate date,
	filedate int,
	team VARCHAR(50),
	name VARCHAR(100),
	games int,
	goals int,
	assists int,
	points int,
	shg_goals int,
	shg_assists int,
	gw_goals int,
	ot_goals int,
	shots int,
	hits int,
	blocks int,
	fo_wins int,
	fo_losses int,
	plusminus int,
	penaltymin int,
	three_stars int,
	two_stars int,
	one_stars int,
	hgm_avg float,
	hgm_total int,
	hgm_value VARCHAR(15)
)

--DROP TABLE hockeygm_stats_d

CREATE TABLE hockeygm_stats_d
(
	insertdate date,
	filedate int,
	team VARCHAR(50),
	name VARCHAR(100),
	games int,
	goals int,
	assists int,
	points int,
	shg_goals int,
	shg_assists int,
	gw_goals int,
	ot_goals int,
	shots int,
	hits int,
	blocks int,
	fo_wins int,
	fo_losses int,
	plusminus int,
	penaltymin int,
	three_stars int,
	two_stars int,
	one_stars int,
	hgm_avg float,
	hgm_total int,
	hgm_value VARCHAR(15)
)

--DROP TABLE hockeygm_stats_g

CREATE TABLE hockeygm_stats_g
(
	insertdate date,
	filedate int,
	team VARCHAR(50),
	name VARCHAR(100),
	games int,
	goals int,
	assists int,
	points int,
	wins int,
	losses int,
	ot_losses int,
	saves int,
	allowed_goals int,
	shutouts int,
	penalties int,
	three_stars int,
	two_stars int,
	one_stars int,
	hgm_avg float,
	hgm_total int,
	hgm_value VARCHAR(15)
)


                  
