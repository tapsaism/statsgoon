CREATE OR REPLACE VIEW staging.hockeygm_stats_all

AS

SELECT
	insertdate,
    filedate,
    team,
    name,
    'FWD' as position,
    games,
    goals,
    assists,
    points,
    0 as wins,
    0 as losses,
    0 as ot_losses,
    0 as saves,
    0 as allowed_goals,
    0 as shutouts,
    shg_goals,
    shg_assists,
    gw_goals,
    ot_goals,
    shots,
    hits,
    blocks,
    fo_wins ,
    fo_losses,
    plusminus,
    penaltymin,
    three_stars,
    two_stars,
    one_stars,
    hgm_avg,
    hgm_total,
    hgm_value

FROM staging.hockeygm_stats_f

UNION

SELECT
	insertdate,
    filedate,
    team,
    name,
    'DEF' as position,
    games,
    goals,
    assists,
    points,
    0 as wins,
    0 as losses,
    0 as ot_losses,
    0 as saves,
    0 as allowed_goals,
    0 as shutouts,
    shg_goals,
    shg_assists,
    gw_goals,
    ot_goals,
    shots,
    hits,
    blocks,
    fo_wins,
    fo_losses,
    plusminus,
    penaltymin,
    three_stars,
    two_stars,
    one_stars,
    hgm_avg,
    hgm_total,
    hgm_value

FROM staging.hockeygm_stats_d

UNION

SELECT

	insertdate,
    filedate,
    team,
    name,
    'GOA' as position,
    games,
    goals,
    assists,
    points,
    wins,
    losses,
    ot_losses,
    saves,
    allowed_goals,
    shutouts,
    null as shg_goals,
    null as shg_assists,
    null as gw_goals,
    null as ot_goals,
    null as shots,
    null as hits,
    null as blocks,
    null as fo_wins,
    null as fo_losses,
    null as plusminus,
    penalties as penaltymin,
    three_stars,
    two_stars,
    one_stars,
    hgm_avg ,
    hgm_total,
    hgm_value 

FROM staging.hockeygm_stats_g;
