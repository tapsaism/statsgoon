create view publish.D_HOCKEYGM_PERIOD

AS

 SELECT season,
    hockeygmperiod,
    min(gamedaydate) AS startdate,
    max(gamedaydate) AS enddate
   FROM staging.nhl_schedule
  WHERE hockeygmperiod IS NOT NULL
  GROUP BY season, hockeygmperiod;