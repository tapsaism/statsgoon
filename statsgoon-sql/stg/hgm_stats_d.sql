CREATE TABLE staging.hgm_stats_d (
	insertdate date NULL,
	filedate int4 NULL,
	team varchar(50) NULL,
	"name" varchar(100) NULL,
	games int4 NULL,
	goals int4 NULL,
	assists int4 NULL,
	points int4 NULL,
	shg_goals int4 NULL,
	shg_assists int4 NULL,
	gw_goals int4 NULL,
	ot_goals int4 NULL,
	shots int4 NULL,
	hits int4 NULL,
	blocks int4 NULL,
	fo_wins int4 NULL,
	fo_losses int4 NULL,
	plusminus int4 NULL,
	penaltymin int4 NULL,
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
