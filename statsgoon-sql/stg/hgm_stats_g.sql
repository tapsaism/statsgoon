CREATE TABLE staging.hgm_stats_g (
	insertdate date NULL,
	filedate int4 NULL,
	team varchar(50) NULL,
	"name" varchar(100) NULL,
	games int4 NULL,
	goals int4 NULL,
	assists int4 NULL,
	points int4 NULL,
	wins int4 NULL,
	losses int4 NULL,
	ot_losses int4 NULL,
	saves int4 NULL,
	allowed_goals int4 NULL,
	shutouts int4 NULL,
	penalties int4 NULL,
	three_stars int4 NULL,
	two_stars int4 NULL,
	one_stars int4 NULL,
	hgm_avg float8 NULL,
	hgm_total int4 NULL,
	hgm_value varchar(15) NULL
)
WITH (
	OIDS=FALSE
) ;
