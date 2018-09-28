import json, codecs

from airflow.exceptions import AirflowException
from airflow.hooks.http_hook import HttpHook
from airflow.hooks.postgres_hook import PostgresHook
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults


class ExtractHtmlOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 xcom_push=False,
                 http_conn_id='http_default',
                 endpoint='',
                 file_name='',
                 *args, **kwargs):

        super(ExtractHtmlOperator, self).__init__(*args, **kwargs)
        self.http_conn_id = http_conn_id
        self.xcom_push_flag = xcom_push
        self.endpoint = endpoint
        self.file_name = file_name

    def execute(self, context):

        http = HttpHook('GET', http_conn_id=self.http_conn_id)

        self.log.info("Calling HTTP method")

        response = http.run(self.endpoint)

        response_content = response.content

        self.log.info("Response received, saving results to local file")

        with open(self.file_name, 'w') as file:
            file.write(str(response_content))

        self.log.info("File saved %s" % self.file_name)
