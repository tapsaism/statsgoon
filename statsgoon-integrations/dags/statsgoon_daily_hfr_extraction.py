from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators import CsvToPostgresOperator
from airflow.operators import ExtractHtmlOperator
from airflow.operators import ParseStatsOperator
from datetime import datetime, timedelta
from schedule import schedule
import time

yesterday = datetime.now() - timedelta(1)
yesterday_formated = yesterday.strftime("%Y-%m-%d")

urls = list(filter(lambda game: game['date'] == yesterday_formated, schedule))

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2018, 10, 07),
    'email': ['internetdata@internetdata.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'catchup': False,
    'retry_delay': timedelta(minutes=3)
}

dag = DAG(
    'statsgoon-daily-hrf-extract',
    default_args=default_args,
    schedule_interval= '0 13 * * *',
    concurrency=1)

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)

for url in urls:

    source_file_name = yesterday_formated + url['url'] + '.html'

    extract_stats_html = ExtractHtmlOperator(
     task_id=url['url'] + '_extract_stats',
     http_conn_id='http_hrf',
     endpoint='boxscores/'+url['url'],
     file_name='temp/html/'+source_file_name,
     dag=dag
    )

    parse_stats = ParseStatsOperator(
     task_id=url['url'] + '_parse_stats',
     source_file_name='temp/html/'+source_file_name,
     goalie_target_file_name='temp/txt/'+url['url'] + '_goalies.txt',
     skater_target_file_name='temp/txt/'+url['url'] + '_skaters.txt',
     dag=dag
    )

    save_skaters_to_db = CsvToPostgresOperator(
       task_id=url['url'] +'_skaters_insert_lines',
       source_file_name='temp/txt/'+url['url'] + '_skaters.txt',
       target_table='staging.stg_hrf_skaters',
       pg_conn_id='postgres_statsgoon',
       dag=dag
    )

    save_goalies_to_db = CsvToPostgresOperator(
       task_id=url['url'] +'_goalies_insert_lines',
       source_file_name='temp/txt/'+url['url'] + '_goalies.txt',
       target_table='staging.stg_hrf_goalies',
       pg_conn_id='postgres_statsgoon',
       dag=dag
    )

    dummy_start >> extract_stats_html >> parse_stats
    parse_stats >> save_skaters_to_db >> dummy_end
    parse_stats >> save_goalies_to_db >> dummy_end
