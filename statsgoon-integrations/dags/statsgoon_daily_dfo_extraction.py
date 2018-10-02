from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators.subdag_operator import SubDagOperator
from airflow.operators import ExtractHtmlOperator
from airflow.operators import ParseLinesOperator
from airflow.operators import CsvToPostgresOperator
from datetime import datetime, timedelta
import time

def extract_html_sub_dag(teams, parent_dag_name, child_dag_name,
                            start_date, schedule_interval):

  dag = DAG(
    '%s.%s' % (parent_dag_name, child_dag_name),
    schedule_interval=schedule_interval,
    start_date=start_date,
  )

  prev_task = None

  for team in teams:

      source_file_name = 'temp/html/%s-lines-%s.html' % (team, cur_date)

      extract_line_html = ExtractHtmlOperator(
       task_id=team + '_extract_lines',
       http_conn_id='http_dfo',
       endpoint=team + '/line-combinations/',
       file_name=source_file_name,
       dag=dag
      )

      if prev_task:
          prev_task >> extract_line_html
          prev_task = extract_line_html
      else:
          prev_task = extract_line_html

  return dag

def parse_lines_sub_dag(teams, parent_dag_name, child_dag_name,
                            start_date, schedule_interval):
  dag = DAG(
    '%s.%s' % (parent_dag_name, child_dag_name),
    schedule_interval=schedule_interval,
    start_date=start_date,
  )

  prev_task = None

  for team in teams:

      source_file_name = 'temp/html/%s-lines-%s.html' % (team, cur_date)
      target_file_name = 'temp/txt/%s-lines-%s.txt' % (team, cur_date)

      parse_line = ParseLinesOperator(
         task_id=team + '_parse_lines',
         source_file_name=source_file_name,
         target_file_name=target_file_name,
         dag=dag
      )

      if prev_task:
          prev_task >> parse_line
          prev_task = parse_line
      else:
          prev_task = parse_line

  return dag

def save_to_db_sub_dag(teams, parent_dag_name, child_dag_name,
                            start_date, schedule_interval):

  dag = DAG(
    '%s.%s' % (parent_dag_name, child_dag_name),
    schedule_interval=schedule_interval,
    start_date=start_date,
  )

  prev_task = None

  for team in teams:

      source_file_name = 'temp/html/%s-lines-%s.html' % (team, cur_date)
      target_file_name = 'temp/txt/%s-lines-%s.txt' % (team, cur_date)

      save_to_db = CsvToPostgresOperator(
         task_id=team +'_insert_lines',
         source_file_name=target_file_name,
         target_table='staging.stg_dfo_lines',
         pg_conn_id='postgres_statsgoon',
         dag=dag
      )

      if prev_task:
          prev_task >> save_to_db
          prev_task = save_to_db
      else:
          prev_task = save_to_db

  return dag

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
    'retry_delay': timedelta(minutes=1)}

dag = DAG(
    'statsgoon-daily-dfo-extract',
    default_args=default_args,
    schedule_interval= '0 11 * * *',
    concurrency=1)

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)


extract_sub_dag = SubDagOperator(
    subdag = extract_html_sub_dag(teams, 'statsgoon-daily-dfo-extract',
                           'extract_html_',
                           datetime(2018, 10, 23),
                           '0 11 * * *'
                           ),
    task_id='extract_html_',
    dag=dag,
  )

parse_sub_dag = SubDagOperator(
     subdag = parse_lines_sub_dag(teams, 'statsgoon-daily-dfo-extract',
                            'parse_lines_',
                            datetime(2018, 10, 23),
                            '0 11 * * *'
                            ),
     task_id='parse_lines_',
     dag=dag,
   )

save_sub_dag = SubDagOperator(
      subdag = save_to_db_sub_dag(teams, 'statsgoon-daily-dfo-extract',
                             'save_lines_',
                             datetime(2018, 10, 23),
                             '0 11 * * *'
                             ),
      task_id='save_lines_',
      dag=dag,
    )

dummy_start >> extract_sub_dag >> parse_sub_dag >> save_sub_dag >> dummy_end
