import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.hooks.postgres_hook import PostgresHook

class RefreshMaterializedViewOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 materialized_view='',
                 pg_conn_id='',
                 *args, **kwargs):

        super(RefreshMaterializedViewOperator, self).__init__(*args, **kwargs)
        self.materialized_view = materialized_view
        self.pg_conn_id = pg_conn_id

    def execute(self, context):
        pg = PostgresHook(postgres_conn_id=self.pg_conn_id)

        sql_statement = 'REFRESH MATERIALIZED VIEW ' + self.materialized_view

        pg.run(sql_statement)
