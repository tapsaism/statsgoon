CREATE TABLE staging.schedule (
	gamedaydate date NULL,
	gamedesc varchar(100) NULL,
	hometeam varchar(50) NULL,
	awayteam varchar(50) NULL,
	gamedayindex int8 NULL,
	hockeygmperiod int4 NULL,
	season int4 NULL
)
WITH (
	OIDS=FALSE
) ;
