from __future__ import division, absolute_import, print_function

from airflow.plugins_manager import AirflowPlugin

import operators

# Defining the plugin class
class StatsgoonPlugin(AirflowPlugin):
    name = "statsgoon_plugin"
    operators = [
        operators.ApiToPostgresOperator,
        operators.ExtractHtmlOperator,
        operators.ParseLinesOperator,
        operators.CsvToPostgresOperator,
        operators.ParsePlayersOperator,
        operators.RefreshMaterializedViewOperator,
        operators.ParseStatsOperator,
        operators.ClusterFuck,
        operators.LinearRegressionOperator
    ]
