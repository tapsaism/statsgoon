from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators import ClusterFuck
from airflow.operators import LinearRegressionOperator
from airflow.operators import CsvToPostgresOperator
from datetime import datetime, timedelta
import time

now = datetime.now()
cur_date = now.strftime("%Y-%m-%d")

cluster_file_name = cur_date + '-clustered.txt'
regression_file_name = cur_date + '-regression.txt'

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2018, 8, 23),
    'email': ['statsgoon@statsgoon.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 3,
    'catchup': False,
    'retry_delay': timedelta(minutes=1)
}

dag = DAG(
    'statsgoon-advanced-analytics',
    default_args=default_args,
    schedule_interval= '0 14 * * *')

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)

cluster_players = ClusterFuck(
 task_id='cluster_players',
 target_file='temp/txt/%s' % cluster_file_name,
 pg_conn_id='postgres_statsgoon',
 dag=dag
)

save_clusters_to_db = CsvToPostgresOperator(
   task_id='save_clusters_to_db',
   source_file_name='temp/txt/%s' % cluster_file_name,
   target_table='analytics.player_clusters',
   pg_conn_id='postgres_statsgoon',
   dag=dag
)

linear_regression = LinearRegressionOperator(
   task_id='linear_regression_players',
   target_file='temp/txt/%s' % regression_file_name,
   pg_conn_id='postgres_statsgoon',
   dag=dag
)

save_regression_to_db = CsvToPostgresOperator(
   task_id='save_regression_to_db',
   source_file_name='temp/txt/%s' % regression_file_name,
   target_table='analytics.player_regressions',
   pg_conn_id='postgres_statsgoon',
   dag=dag
)

dummy_start >> cluster_players >> save_clusters_to_db >> dummy_end
dummy_start >> linear_regression >> save_regression_to_db >> dummy_end
