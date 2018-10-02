import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.hooks.postgres_hook import PostgresHook
import time
from datetime import datetime

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class RefreshMaterializedViewOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 view_name='',
                 pg_conn_id='',
                 *args, **kwargs):

        super(RefreshMaterializedViewOperator, self).__init__(*args, **kwargs)
        self.view_name = view_name
        self.pg_conn_id = pg_conn_id

    def execute(self, context):
        pg = PostgresHook(postgres_conn_id=self.pg_conn_id)

        statement = 'REFRESH MATERIALIZED VIEW %s' % self.view_name

        pg.run(statement)
