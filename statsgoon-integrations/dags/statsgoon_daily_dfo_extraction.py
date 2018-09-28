from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators import ExtractHtmlOperator
from airflow.operators import ParseLinesOperator
from airflow.operators import CsvToPostgresOperator
from datetime import datetime, timedelta
import time

teams = [
 'anaheim-ducks', 'arizona-coyotes', 'boston-bruins', 'buffalo-sabres',
 'calgary-flames', 'carolina-hurricanes','chicago-blackhawks',
 'colorado-avalanche', 'columbus-blue-jackets', 'dallas-stars',
 'detroit-red-wings', 'edmonton-oilers', 'florida-panthers','los-angeles-kings',
 'minnesota-wild','montreal-canadiens','nashville-predators','new-jersey-devils',
 'new-york-islanders','new-york-rangers','ottawa-senators','philadelphia-flyers',
 'pittsburgh-penguins','san-jose-sharks','st-louis-blues','tampa-bay-lightning',
 'toronto-maple-leafs','vancouver-canucks','vegas-golden-knights',
 'washington-capitals','winnipeg-jets'
]

now = datetime.now()
cur_date = now.strftime("%Y-%m-%d")

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2018, 8, 23),
    'email': ['internetdata@internetdata.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'catchup': False,
    'retry_delay': timedelta(minutes=1)
}

dag = DAG(
    'statsgoon-daily-dfo-extract',
    default_args=default_args,
    schedule_interval= '0 11 * * *')

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)

for team in teams:

 source_file_name = 'temp/html/%s-lines-%s.html' % (team, cur_date)
 target_file_name = 'temp/txt/%s-lines-%s.txt' % (team, cur_date)

 extract_line_html = ExtractHtmlOperator(
  task_id=team + '_extract_lines',
  http_conn_id='http_dfo',
  endpoint=team + '/line-combinations/',
  file_name=source_file_name,
  dag=dag
 )

 parse_line = ParseLinesOperator(
    task_id=team + '_parse_lines',
    source_file_name=source_file_name,
    target_file_name=target_file_name,
    dag=dag
 )

 save_to_db = CsvToPostgresOperator(
    task_id=team +'_insert_lines',
    source_file_name=target_file_name,
    target_table='staging.stg_dfo_lines',
    pg_conn_id='postgres_statsgoon',
    dag=dag
 )

 dummy_start >> extract_line_html >> parse_line >> save_to_db >> dummy_end
