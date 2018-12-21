from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.bash_operator import BashOperator
from airflow.operators import CsvToPostgresOperator
from airflow.operators import ParsePlayersOperator
from datetime import datetime, timedelta
import time

now = datetime.now()
cur_date = now.strftime("%Y-%m-%d")

html_file_name = cur_date + '-hgm-players.html'
cmd_command = 'curl -v --cookie "hgmsticky=ffc84514a36c414b58fc97e66c7522debd38e01424ab0c23df647d97" https://www.hockeygm.fi/team/search-players?phase=total >> /usr/local/airflow/temp/html/'

txt_file_name = cur_date + '-hgm-players.txt'

positions = [
    {'pos':'goalie','table':'stg_hgm_goalies'},
    {'pos':'defenseman','table':'stg_hgm_dmen'},
    {'pos':'forward','table':'stg_hgm_forwards'}
]

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
    'statsgoon-daily-hgm-extract',
    default_args=default_args,
    schedule_interval= '0 8 * * *')

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)

extract_players_html = BashOperator(
 task_id='extract_hgm_players',
 bash_command=cmd_command + html_file_name,
 dag=dag
)

dummy_start >> extract_players_html

for position in positions:

 parse_player_txt = ParsePlayersOperator(
  task_id='parse_hgm_players_'+ position['pos'],
  source_file_name='temp/html/'+html_file_name,
  target_file_name='temp/txt/'+position['pos']+'-'+txt_file_name,
  position=position['pos'],
  dag=dag
 )

 save_to_db = CsvToPostgresOperator(
    task_id=position['pos'] +'_insert_lines',
    source_file_name='temp/txt/'+position['pos']+'-'+txt_file_name,
    target_table='staging.'+position['table'],
    pg_conn_id='postgres_statsgoon',
    dag=dag
 )

 extract_players_html >> parse_player_txt >> save_to_db >> dummy_end
