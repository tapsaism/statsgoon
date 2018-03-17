 CREATE OR REPLACE VIEW staging.hockey_reference_general_stats_pivot AS
 SELECT "left"(measure_value.player_date, 10) AS game_date,
    "substring"(measure_value.player_date, 11, 50) AS player,
    measure_value.assists,
    measure_value.assists_ev,
    measure_value.assists_pp,
    measure_value.assists_sh,
    measure_value.decision,
    measure_value.goals,
    measure_value.goals_against,
    measure_value.goals_ev,
    measure_value.goals_gw,
    measure_value.goals_pp,
    measure_value.goals_sh,
    measure_value.pen_min,
    measure_value.plus_minus,
    measure_value.points,
    measure_value.ranker,
    measure_value.save_pct,
    measure_value.saves,
    measure_value.shifts,
    measure_value.shot_pct,
    measure_value.shots,
    measure_value.shots_against,
    measure_value.shutouts,
    measure_value.time_on_ice
   FROM crosstab('SELECT 
				to_date(date,''Month DD, YYYY'') || player,
				measure,
				measure_value
			FROM staging.hockeyreference_stats_all 
			WHERE player not in (''Player'',''TOTAL'','''') 
			AND stat_type = ''general''
			AND measure != ''player''
			ORDER BY 1'::text, 'SELECT DISTINCT 
				measure 
			FROM staging.hockeyreference_stats_all 
			WHERE stat_type = ''general''
			AND measure != ''player''
			ORDER BY 1'::text) measure_value(player_date text, assists text, assists_ev text, assists_pp text, assists_sh text, decision text, goals text, goals_against text, goals_ev text, goals_gw text, goals_pp text, goals_sh text, pen_min text, plus_minus text, points text, ranker text, save_pct text, saves text, shifts text, shot_pct text, shots text, shots_against text, shutouts text, time_on_ice text);


