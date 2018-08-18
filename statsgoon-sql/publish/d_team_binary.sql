
CREATE VIEW publish.d_team_binary

AS

SELECT
*
FROM CROSSTAB('SELECT
team,
team_acronym,
opponent,
CASE WHEN team_acronym = opponent THEN 1 ELSE 0 END AS marker
FROM publish.d_team

CROSS JOIN (
	SELECT team_acronym AS opponent FROM publish.d_team	
) AS teams
ORDER BY team_acronym
'::text,
'SELECT DISTINCT 
team_acronym 
FROM publish.d_team
ORDER BY team_acronym'::text)
marker(
team text,
team_acronym text,
ANA text,
ARI text,
BOS text,
BUF text,
CAR text,
CGY text,
CHI text,
CJB text,
COL text,
DAL text,
DET text,
EDM text,
FLA text,
LAK text,
MIN text,
MON text,
NAS text,
NJD text,
NYI text,
NYR text,
OTT text,
PHI text,
PIT text,
SJS text,
STL text,
TBL text,
TOR text,
VAN text,
VGK text,
WPG text,
WSH text
)

SELECT * FROM publish.d_team_binary
