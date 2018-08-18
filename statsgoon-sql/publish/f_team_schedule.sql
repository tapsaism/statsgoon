CREATE OR REPLACE VIEW publish.f_team_schedule AS
 
WITH teams_with_dates
AS
(
	SELECT DISTINCT 
	nhl_schedule.gamedaydate,
	nhl_schedule.hockeygmperiod,
	nhl_schedule.season,
	teams.team
	
	FROM staging.nhl_schedule

	CROSS JOIN (	
			SELECT DISTINCT 
			team
           	FROM staging.hockeygm_stats_all
           	) teams
) 

SELECT teams_with_dates.gamedaydate AS date,
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
    COALESCE(home_games.awayteam, away_games.hometeam) AS opponent,
    CASE WHEN COALESCE(home_games.awayteam, away_games.hometeam) IS NOT NULL
    		THEN ROW_NUMBER() OVER (PARTITION BY teams_with_dates.team, teams_with_dates.season,CASE WHEN COALESCE(home_games.awayteam, away_games.hometeam) IS NOT NULL THEN 1 ELSE 0 END ORDER BY teams_with_dates.gamedaydate) 
   		ELSE NULL
   	END AS game_nbr
    
   FROM teams_with_dates
     
   	 LEFT JOIN staging.nhl_schedule home_games 
     	ON home_games.hometeam::text = teams_with_dates.team::text 
     	AND home_games.gamedaydate = teams_with_dates.gamedaydate
     
     LEFT JOIN staging.nhl_schedule away_games 
		ON away_games.awayteam::text = teams_with_dates.team::text 
		AND away_games.gamedaydate = teams_with_dates.gamedaydate;
