DROP MATERIALIZED VIEW api.neural_network_data;

CREATE MATERIALIZED VIEW api.neural_network_data

AS

WITH team_goals AS (

	SELECT
	stats.game_date,
	players.team,
	sched.game_nbr,
	SUM(goals::int) goals,
	SUM(goals_pp::int) pp_goals,
	SUM(pen_min::int) pen_min,
	SUM(shots::int) shots
	FROM publish.f_skater_nhl_stats stats
	
	INNER JOIN publish.d_player_history players
	ON UPPER(stats.player) = UPPER(players.formatted_name)
	AND replace(stats.game_date,'-','')::int = players.filedate
	
	INNER JOIN publish.f_team_schedule sched
	ON sched.team = players.team
	AND sched."date"::text = stats.game_date
	
	GROUP BY
	sched.game_nbr,
	stats.game_date,
	players.team

)

,schedule_and_results AS (

SELECT

sched.date,
sched.season,
sched.hometeam,
home_team.team_acronym AS home_team_team_acronym,
home_goals.shots AS home_shots,
home_goals.goals AS home_goals,
home_goals.pp_goals AS home_pp_goals,
home_goals.pen_min AS home_pen_min,
home_goals.game_nbr home_team_game_nbr,
sched.awayteam,
away_team.team_acronym AS away_team_team_acronym,
away_goals.shots AS away_shots,
away_goals.goals AS away_goals,
away_goals.pp_goals AS away_pp_goals,
away_goals.pen_min AS away_pen_min,
away_goals.game_nbr away_team_game_nbr,
CASE 
	WHEN home_goals.goals > away_goals.goals THEN hometeam
	WHEN home_goals.goals < away_goals.goals THEN awayteam
END AS winner

FROM publish.f_schedule sched

INNER JOIN team_goals home_goals
ON sched.date::text = home_goals.game_date
AND sched.hometeam = home_goals.team

INNER JOIN team_goals away_goals
ON sched.date::text = away_goals.game_date
AND sched.awayteam = away_goals.team

INNER JOIN publish.d_team home_team
ON home_team.team = sched.hometeam

INNER JOIN publish.d_team away_team
ON away_team.team = sched.awayteam

)

,team_results AS (

SELECT
date,
season,
hometeam AS team,
home_shots AS shots,
home_goals AS goals,
home_pp_goals AS pp_goals,
home_pen_min AS pen_min,
awayteam AS opponent,
home_team_game_nbr AS game_nbr,
'home' AS location,
winner

FROM schedule_and_results

UNION  

SELECT
date,
season,
awayteam AS team,
away_shots AS shots,
away_goals AS goals,
away_pp_goals AS pp_goals,
away_pen_min AS pen_min,
hometeam AS opponent,
away_team_game_nbr AS game_nbr,
'away' AS location,
winner

FROM schedule_and_results
)
/*
starting_goalie AS (

SELECT 
game_date::date AS date,
player,
decision,
shots_against,
coalesce(player.team,history.team) team,
history.line_position
FROM publish.f_goalie_nhl_stats stats

LEFT JOIN publish.d_player_team player
ON upper(player.formatted_name) = upper(stats.player)
AND (upper(replace(stats.game_date,'-',''))::int >= player.start_date
AND upper(replace(stats.game_date,'-',''))::int <= player.end_date)

LEFT JOIN publish.d_player_history history
ON upper(history.formatted_name) = upper(stats.player)
AND upper(replace(stats.game_date,'-',''))::int = history.filedate

WHERE line_position IS NOT null

)
*/
/*
SELECT

--DEBUG
results.team,
results.opponent,
results.location,
results.winner,
LAG(results.winner,1) OVER (PARTITION BY results.team,results.season ORDER BY results.game_nbr) AS previous_game,

CASE WHEN results.location = 'home' THEN 1 ELSE 0 END AS home,
CASE WHEN results.location = 'away' THEN 1 ELSE 0 END AS away,
CASE WHEN results.winner = results.team THEN 1 ELSE 0 END AS win,
CASE WHEN results.winner = results.opponent THEN 1 ELSE 0 END AS lose,
CASE WHEN results.winner IS NULL THEN 1 ELSE 0 END AS tie,
CASE WHEN LAG(results.winner,1) OVER (PARTITION BY results.team,results.season ORDER BY results.game_nbr) = results.team THEN 1 ELSE 0 END AS prev_game_win,
CASE WHEN LAG(results.winner,1) OVER (PARTITION BY results.team,results.season ORDER BY results.game_nbr) != results.team THEN 1 ELSE 0 END AS prev_game_lose,
CASE WHEN LAG(results.winner,1) OVER (PARTITION BY results.team,results.season ORDER BY results.game_nbr) IS NULL THEN 1 ELSE 0 END AS prev_game_tie,
CASE WHEN results.shots > 20 THEN 1 ELSE 0 END shots_over_20,
CASE WHEN results.shots > 30 THEN 1 ELSE 0 END shots_over_30,
CASE WHEN results.shots > 40 THEN 1 ELSE 0 END shots_over_40,
CASE WHEN results.pp_goals > 0 THEN 1 ELSE 0 END pp_goals,
CASE WHEN results.pen_min > 0 THEN 1 ELSE 0 END penalties,
CASE WHEN results.pen_min > 6 THEN 1 ELSE 0 END pen_min_over_6,
CASE WHEN results.pen_min > 10 THEN 1 ELSE 0 END pen_min_over_10,
CASE WHEN results.pen_min > 16 THEN 1 ELSE 0 END pen_min_over_16,

CASE 
	WHEN starting_goalie.line_position = 'G1' THEN '1'
	WHEN starting_goalie.line_position = 'G2' THEN '0'
	ELSE 'N/A'
END goalie_1,
CASE 
	WHEN starting_goalie.line_position = 'G2' THEN '1'
	WHEN starting_goalie.line_position = 'G1' THEN '0'
	ELSE 'N/A'
END goalie_2,

team_bin.ana,
team_bin.ari,
team_bin.bos,
team_bin.buf,
team_bin.car,
team_bin.cgy,
team_bin.chi,
team_bin.cjb,
team_bin.col,
team_bin.dal,
team_bin.det,
team_bin.edm,
team_bin.fla,
team_bin.lak,
team_bin.min,
team_bin.mon,
team_bin.nas,
team_bin.njd,
team_bin.nyi,
team_bin.nyr,
team_bin.ott,
team_bin.phi,
team_bin.pit,
team_bin.sjs,
team_bin.stl,
team_bin.tbl,
team_bin.tor,
team_bin.van,
team_bin.vgk,
team_bin.wpg,
team_bin.wsh,
oppo_bin.ana as oppo_ana,
oppo_bin.ari as oppo_ari,
oppo_bin.bos as oppo_bos,
oppo_bin.buf as oppo_buf,
oppo_bin.car as oppo_car,
oppo_bin.cgy as oppo_cgy,
oppo_bin.chi as oppo_chi,
oppo_bin.cjb as oppo_cjb,
oppo_bin.col as oppo_col,
oppo_bin.dal as oppo_dal,
oppo_bin.det as oppo_det,
oppo_bin.edm as oppo_edm,
oppo_bin.fla as oppo_fla,
oppo_bin.lak as oppo_lak,
oppo_bin.min as oppo_min,
oppo_bin.mon as oppo_mon,
oppo_bin.nas as oppo_nas,
oppo_bin.njd as oppo_njd,
oppo_bin.nyi as oppo_nyi,
oppo_bin.nyr as oppo_nyr,
oppo_bin.ott as oppo_ott,
oppo_bin.phi as oppo_phi,
oppo_bin.pit as oppo_pit,
oppo_bin.sjs as oppo_sjs,
oppo_bin.stl as oppo_stl,
oppo_bin.tbl as oppo_tbl,
oppo_bin.tor as oppo_tor,
oppo_bin.van as oppo_van,
oppo_bin.vgk as oppo_vgk,
oppo_bin.wpg as oppo_wpg,
oppo_bin.wsh as oppo_wsh

FROM team_results results

INNER JOIN publish.d_team_binary team_bin
ON team_bin.team = results.team

INNER JOIN publish.d_team_binary oppo_bin
ON oppo_bin.team = results.opponent;
*/


SELECT * FROM schedule_and_results


