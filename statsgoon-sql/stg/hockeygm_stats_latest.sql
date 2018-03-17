create or replace view staging.hockeygm_stats_latest

AS
	(
	SELECT hockeygm_stats_f.insertdate,
    hockeygm_stats_f.filedate,
    hockeygm_stats_f.team,
    hockeygm_stats_f.name,
    'FWD'::text AS "position",
    hockeygm_stats_f.games,
    hockeygm_stats_f.goals,
    hockeygm_stats_f.assists,
    hockeygm_stats_f.points,
    0 AS wins,
    0 AS losses,
    0 AS ot_losses,
    0 AS saves,
    0 AS allowed_goals,
    0 AS shutouts,
    hockeygm_stats_f.shg_goals,
    hockeygm_stats_f.shg_assists,
    hockeygm_stats_f.gw_goals,
    hockeygm_stats_f.ot_goals,
    hockeygm_stats_f.shots,
    hockeygm_stats_f.hits,
    hockeygm_stats_f.blocks,
    hockeygm_stats_f.fo_wins,
    hockeygm_stats_f.fo_losses,
    hockeygm_stats_f.plusminus,
    hockeygm_stats_f.penaltymin,
    hockeygm_stats_f.three_stars,
    hockeygm_stats_f.two_stars,
    hockeygm_stats_f.one_stars,
    hockeygm_stats_f.hgm_avg,
    hockeygm_stats_f.hgm_total,
    hockeygm_stats_f.hgm_value
   FROM staging.hockeygm_stats_f
   
   where filedate = (select MAX(filedate) from staging.hockeygm_stats_f)
   
union
 
 SELECT hockeygm_stats_d.insertdate,
    hockeygm_stats_d.filedate,
    hockeygm_stats_d.team,
    hockeygm_stats_d.name,
    'DEF'::text AS "position",
    hockeygm_stats_d.games,
    hockeygm_stats_d.goals,
    hockeygm_stats_d.assists,
    hockeygm_stats_d.points,
    0 AS wins,
    0 AS losses,
    0 AS ot_losses,
    0 AS saves,
    0 AS allowed_goals,
    0 AS shutouts,
    hockeygm_stats_d.shg_goals,
    hockeygm_stats_d.shg_assists,
    hockeygm_stats_d.gw_goals,
    hockeygm_stats_d.ot_goals,
    hockeygm_stats_d.shots,
    hockeygm_stats_d.hits,
    hockeygm_stats_d.blocks,
    hockeygm_stats_d.fo_wins,
    hockeygm_stats_d.fo_losses,
    hockeygm_stats_d.plusminus,
    hockeygm_stats_d.penaltymin,
    hockeygm_stats_d.three_stars,
    hockeygm_stats_d.two_stars,
    hockeygm_stats_d.one_stars,
    hockeygm_stats_d.hgm_avg,
    hockeygm_stats_d.hgm_total,
    hockeygm_stats_d.hgm_value
   FROM staging.hockeygm_stats_d
   
   where filedate = (select MAX(filedate) from staging.hockeygm_stats_d)
   
union
 
 SELECT hockeygm_stats_g.insertdate,
    hockeygm_stats_g.filedate,
    hockeygm_stats_g.team,
    hockeygm_stats_g.name,
    'GOA'::text AS "position",
    hockeygm_stats_g.games,
    hockeygm_stats_g.goals,
    hockeygm_stats_g.assists,
    hockeygm_stats_g.points,
    hockeygm_stats_g.wins,
    hockeygm_stats_g.losses,
    hockeygm_stats_g.ot_losses,
    hockeygm_stats_g.saves,
    hockeygm_stats_g.allowed_goals,
    hockeygm_stats_g.shutouts,
    NULL::integer AS shg_goals,
    NULL::integer AS shg_assists,
    NULL::integer AS gw_goals,
    NULL::integer AS ot_goals,
    NULL::integer AS shots,
    NULL::integer AS hits,
    NULL::integer AS blocks,
    NULL::integer AS fo_wins,
    NULL::integer AS fo_losses,
    NULL::integer AS plusminus,
    hockeygm_stats_g.penalties AS penaltymin,
    hockeygm_stats_g.three_stars,
    hockeygm_stats_g.two_stars,
    hockeygm_stats_g.one_stars,
    hockeygm_stats_g.hgm_avg,
    hockeygm_stats_g.hgm_total,
    hockeygm_stats_g.hgm_value
    
   FROM staging.hockeygm_stats_g

   where filedate = (select MAX(filedate) from staging.hockeygm_stats_g)
   );
