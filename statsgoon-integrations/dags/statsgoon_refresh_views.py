from airflow import DAG
from airflow.operators.dummy_operator import DummyOperator
from airflow.operators import RefreshMaterializedViewOperator
from datetime import datetime, timedelta
import time

views = [
    'api.daily_stats',
    'api.schedule_current_period',
    'api.schedule_current_period_player',
    'api.schedule_today',
    'api.solver_data',
    'api.team_game_results',
    'api.team_games_left',
    'api.team_points_by_season',
    'api.top_players_by_season'
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
    'retry_delay': timedelta(minutes=1)}

dag = DAG(
    'statsgoon-daily-view-refresh',
    default_args=default_args,
    schedule_interval= '0 10 * * *',
    concurrency=1)

dummy_start = DummyOperator(
    task_id='start_load',
    dag=dag)

dummy_end = DummyOperator(
    task_id='end_load',
    dag=dag)

prev_task = None

for view in views:
    refresh_view = RefreshMaterializedViewOperator(
       task_id='refresh_view_' + view,
       view_name=view,
       pg_conn_id='postgres_statsgoon',
       dag=dag
     )

    if prev_task:
        prev_task >> refresh_view
        prev_task = refresh_view
    else:
        dummy_start >> refresh_view
        prev_task = refresh_view
        
prev_task >> dummy_end
