CREATE VIEW api.schedule

AS
     
SELECT date,
sched.season,
sched.hockeygmperiod,
team.team,
team.team_acronym AS team_acrm,
awaygame,
homegame,
game,
opponent.team as opponent,
opponent.team_acronym AS opponent_acrm

FROM publish.f_team_schedule sched
   
INNER JOIN publish.d_team team
	ON sched.team = team.team
   	
LEFT JOIN publish.d_team opponent
	ON sched.opponent = opponent.team