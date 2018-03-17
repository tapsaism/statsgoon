create view publish.f_team_schedule

as

SELECT
teams_with_dates.gamedaydate as date,
teams_with_dates.season,
teams_with_dates.hockeygmperiod,
teams_with_dates.team,
CASE
   WHEN home_games.hometeam IS NULL AND away_games.awayteam IS NOT NULL THEN 1
   ELSE 0
END AS awaygame,
CASE
   WHEN home_games.hometeam IS NOT NULL AND away_games.awayteam IS NULL THEN 1
   ELSE 0
END AS homegame,
CASE
   WHEN home_games.hometeam IS NULL AND away_games.awayteam IS NOT NULL THEN 1
   WHEN home_games.hometeam IS NOT NULL AND away_games.awayteam IS NULL THEN 1
   ELSE 0
END AS game,
COALESCE(home_games.awayteam, away_games.hometeam) AS opponent

from
(

	select distinct
	gamedaydate, 
	hockeygmperiod,
	season,
	team
	from staging.nhl_schedule
	
	cross join (
			select DISTINCT team from staging.hockeygm_stats_latest
	) as teams

) as teams_with_dates

left join staging.nhl_schedule home_games
on home_games.hometeam = teams_with_dates.team
and home_games.gamedaydate = teams_with_dates.gamedaydate

left join staging.nhl_schedule away_games
on away_games.awayteam = teams_with_dates.team
and away_games.gamedaydate = teams_with_dates.gamedaydate
