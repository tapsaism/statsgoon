CREATE VIEW api.all_players

AS

SELECT
formatted_name AS name,
POSITION,
hgm_value AS player_latest_value,
team
FROM publish.d_player