from operators.api_postgres import ApiToPostgresOperator
from operators.extract_html import ExtractHtmlOperator
from operators.parse_lines import ParseLinesOperator
from operators.csv_postgres import CsvToPostgresOperator
from operators.parse_players import ParsePlayersOperator
from operators.parse_stats import ParseStatsOperator
from operators.refresh_matview import RefreshMaterializedViewOperator
from operators.cluster_fuck import ClusterFuck
from operators.linear_regression import LinearRegressionOperator

__all__ = [
    'ApiToPostgresOperator',
    'ExtractHtmlOperator',
    'ParseLinesOperator',
    'CsvToPostgresOperator',
    'ParsePlayersOperator',
    'RefreshMaterializedViewOperator',
    'ParseStatsOperator',
    'ClusterFuck',
    'LinearRegressionOperator'
]
