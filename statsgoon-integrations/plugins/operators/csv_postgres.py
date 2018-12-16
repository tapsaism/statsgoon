import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.hooks.postgres_hook import PostgresHook
import time
from datetime import datetime

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class CsvToPostgresOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 source_file_name='',
                 target_table='',
                 pg_conn_id='',
                 *args, **kwargs):

        super(CsvToPostgresOperator, self).__init__(*args, **kwargs)
        self.source_file_name = source_file_name
        self.target_table = target_table
        self.pg_conn_id = pg_conn_id

    def execute(self, context):
        pg = PostgresHook(postgres_conn_id=self.pg_conn_id)

        data = open(self.source_file_name,'r')

        lines = data.read().split('\n')

        tuples = []

        for line in lines:
            if len(line) > 0:
                line_with_default = timestamp + '|' + self.source_file_name + '|' + line
                vals = list(line_with_default.split('|'))
                str_vals = map(lambda x: str(x),vals)
                tuples.append(str_vals)

        self.log.info("Inserting %s records to %s" % (str(len(tuples)), self.target_table))

        pg.insert_rows(self.target_table, tuples, commit_every=1000)
