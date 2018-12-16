from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.hooks.postgres_hook import PostgresHook
#Load the required packages
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans

class ClusterFuck(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 target_file='',
                 pg_conn_id='',
                 *args, **kwargs):

        super(ClusterFuck, self).__init__(*args, **kwargs)
        self.target_file = target_file
        self.pg_conn_id = pg_conn_id

    def execute(self, context):
        query = """
                SELECT
                    playername as name,
                    team as team,
                    LEFT(value,3)::int AS value,
                    points_total
                FROM api.solver_data
                WHERE season = '2018-2019'
                    AND points_total is not null
                ORDER BY points_total
                """

        pg = PostgresHook(postgres_conn_id=self.pg_conn_id)
        df = pg.get_pandas_df(query)

        players = df['name']
        teams = df['team']
        df = df.drop(['name'], axis=1)
        df = df.drop(['team'], axis=1)
        print(df)

        km=KMeans(n_clusters=6,init='k-means++', max_iter=300, n_init=10, random_state=0)
        y_means = km.fit_predict(df)
        df['clusters'] = y_means
        df["name"] = players
        df["team"] = teams

        df.to_csv(self.target_file, sep='|', index=False, header=False)
