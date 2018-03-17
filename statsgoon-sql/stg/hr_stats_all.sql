CREATE TABLE staging.hr_stats_all (
	file_name varchar(50) NULL,
	insert_date date NULL,
	title varchar(255) NULL,
	"date" varchar(50) NULL,
	home_team varchar(50) NULL,
	away_team varchar(50) NULL,
	stat_type varchar(50) NULL,
	player_id varchar(255) NULL,
	player varchar(255) NULL,
	measure varchar(50) NULL,
	measure_value varchar(100) NULL
)
WITH (
	OIDS=FALSE
) ;
