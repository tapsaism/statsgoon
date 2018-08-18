CREATE OR REPLACE VIEW publish.f_schedule

AS

SELECT  
gamedaydate AS date,
gamedesc AS description,
hometeam,
awayteam,
season
FROM staging.nhl_schedule
