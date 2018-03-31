CREATE OR REPLACE VIEW publish.d_team 

AS

SELECT DISTINCT staging.hockeygm_stats_all.team,
        CASE
            WHEN team::text = 'Anaheim'::text THEN 'ANA'::text
            WHEN team::text = 'Arizona'::text THEN 'ARI'::text
            WHEN team::text = 'Boston'::text THEN 'BOS'::text
            WHEN team::text = 'Buffalo'::text THEN 'BUF'::text
            WHEN team::text = 'Carolina'::text THEN 'CAR'::text
            WHEN team::text = 'Calgary'::text THEN 'CGY'::text
            WHEN team::text = 'Chicago'::text THEN 'CHI'::text
            WHEN team::text = 'Columbus'::text THEN 'CJB'::text
            WHEN team::text = 'Colorado'::text THEN 'COL'::text
            WHEN team::text = 'Dallas'::text THEN 'DAL'::text
            WHEN team::text = 'Detroit'::text THEN 'DET'::text
            WHEN team::text = 'Edmonton'::text THEN 'EDM'::text
            WHEN team::text = 'Florida'::text THEN 'FLA'::text
            WHEN team::text = 'Los Angeles'::text THEN 'LAK'::text
            WHEN team::text = 'Minnesota'::text THEN 'MIN'::text
            WHEN team::text = 'Montreal'::text THEN 'MON'::text
            WHEN team::text = 'Nashville'::text THEN 'NAS'::text
            WHEN team::text = 'New Jersey'::text THEN 'NJD'::text
            WHEN team::text = 'NY Islanders'::text THEN 'NYI'::text
            WHEN team::text = 'NY Rangers'::text THEN 'NYR'::text
            WHEN team::text = 'Ottawa'::text THEN 'OTT'::text
            WHEN team::text = 'Philadelphia'::text THEN 'PHI'::text
            WHEN team::text = 'Pittsburgh'::text THEN 'PIT'::text
            WHEN team::text = 'San Jose'::text THEN 'SJS'::text
            WHEN team::text = 'St. Louis'::text THEN 'STL'::text
            WHEN team::text = 'Tampa Bay'::text THEN 'TBL'::text
            WHEN team::text = 'Toronto'::text THEN 'TOR'::text
            WHEN team::text = 'Vancouver'::text THEN 'VAN'::text
            WHEN team::text = 'Vegas'::text THEN 'VGK'::text
            WHEN team::text = 'Washington'::text THEN 'WSH'::text
            WHEN team::text = 'Winnipeg'::text THEN 'WPG'::text
            ELSE NULL::text
        END AS team_acronym,
        CASE
        		WHEN team::text in ('Washington','Pittsburgh','Philadelphia',
        											'New Jersey','NY Islanders','Columbus','Carolina','NY Rangers')
        											THEN 'Metropolitan'
        		WHEN team::text in ('Tampa Bay','Boston','Toronto',
        											'Florida','Detroit','Ottawa','Montreal','Buffalo')
        											THEN 'Atlantic'
        		WHEN team::text in ('Nashville','Winnipeg','Dallas',
        											'St. Louis','Minnesota','Colorado','Chicago')
        											THEN 'Central'
        		WHEN team::text in ('Vegas','San Jose','Anaheim',
        											'Calgary','Los Angeles','Vancouver','Edmonton','Arizona')
        											THEN 'Pacific'
        END AS team_division,
        CASE
        		WHEN team::text in ('Washington','Pittsburgh','Philadelphia',
        							'New Jersey','NY Islanders','Columbus','Carolina','NY Rangers',
								'Tampa Bay','Boston','Toronto',
        							'Florida','Detroit','Ottawa','Montreal','Buffalo')
        											THEN 'Eastern'
        		WHEN team::text in ('Nashville','Winnipeg','Dallas',
        							'St. Louis','Minnesota','Colorado','Chicago',
        							'Vegas','San Jose','Anaheim',
        							'Calgary','Los Angeles','Vancouver','Edmonton','Arizona')
        											THEN 'Western'
        END AS team_conference,
         CASE
            WHEN team::text = 'Anaheim'::text THEN 'Anaheim Ducks'::text
            WHEN team::text = 'Arizona'::text THEN 'Arizona Coyotes'::text
            WHEN team::text = 'Boston'::text THEN 'Boston Bruins'::text
            WHEN team::text = 'Buffalo'::text THEN 'Buffalo Sabres'::text
            WHEN team::text = 'Carolina'::text THEN 'Carolina Hurricanes'::text
            WHEN team::text = 'Calgary'::text THEN 'Calgary Flames'::text
            WHEN team::text = 'Chicago'::text THEN 'Chicago Blackhawks'::text
            WHEN team::text = 'Columbus'::text THEN 'Columbus Blue Jackets'::text
            WHEN team::text = 'Colorado'::text THEN 'Colorado Avalanche'::text
            WHEN team::text = 'Dallas'::text THEN 'Dallas Stars'::text
            WHEN team::text = 'Detroit'::text THEN 'Detroit Red Wings'::text
            WHEN team::text = 'Edmonton'::text THEN 'Edmonton Oilers'::text
            WHEN team::text = 'Florida'::text THEN 'Florida Panthers'::text
            WHEN team::text = 'Los Angeles'::text THEN 'Los Angeles Kings'::text
            WHEN team::text = 'Minnesota'::text THEN 'Minnesota Wild'::text
            WHEN team::text = 'Montreal'::text THEN 'Montreal Canadiens'::text
            WHEN team::text = 'Nashville'::text THEN 'Nashville Predators'::text
            WHEN team::text = 'New Jersey'::text THEN 'New Jersey Devils'::text
            WHEN team::text = 'NY Islanders'::text THEN 'New York Islanders'::text
            WHEN team::text = 'NY Rangers'::text THEN 'New York Rangers'::text
            WHEN team::text = 'Ottawa'::text THEN 'Ottawa Senators'::text
            WHEN team::text = 'Philadelphia'::text THEN 'Philadelphia Flyers'::text
            WHEN team::text = 'Pittsburgh'::text THEN 'Pittsburgh Penguins'::text
            WHEN team::text = 'San Jose'::text THEN 'San Jose Sharks'::text
            WHEN team::text = 'St. Louis'::text THEN 'St Louis Blues'::text
            WHEN team::text = 'Tampa Bay'::text THEN 'Tampa Bay Lightning'::text
            WHEN team::text = 'Toronto'::text THEN 'Toronto Maple Leafs'::text
            WHEN team::text = 'Vancouver'::text THEN 'Vancouver Canucks'::text
            WHEN team::text = 'Vegas'::text THEN 'Las Vegas Knights'::text
            WHEN team::text = 'Washington'::text THEN 'Washington Capitals'::text
            WHEN team::text = 'Winnipeg'::text THEN 'Winnipeg Jets'::text
            ELSE NULL::text
        END AS team_long_name
   FROM staging.hockeygm_stats_all
  WHERE staging.hockeygm_stats_all.team IS NOT NULL;