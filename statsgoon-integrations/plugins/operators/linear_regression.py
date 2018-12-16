from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.hooks.postgres_hook import PostgresHook
#Load the required packages
from sklearn.linear_model import LinearRegression
import pandas as pd
import time
from datetime import datetime

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class LinearRegressionOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 target_file='',
                 pg_conn_id='',
                 *args, **kwargs):

        super(LinearRegressionOperator, self).__init__(*args, **kwargs)
        self.target_file = target_file
        self.pg_conn_id = pg_conn_id

    def execute(self, context):
        query = """
                SELECT
                    filedate,
                    player,
                    points_daily
                FROM api.daily_stats
                WHERE game_played = 1
                    AND season = '2018-2019'
                ORDER BY player, filedate
                """

        pg = PostgresHook(postgres_conn_id=self.pg_conn_id)
        rows = pg.get_records(query)

        linearReg = LinearRegression()

        i = 0
        X = []
        Y = []
        y_sum = 0
        player = ''
        # games = [1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80]
        games = range(1,83)
        results = []

        self.log.info("%s records to loop" % str(len(rows)))

        for row in rows:
            if player == '':
                player = row[1]

            if player != row[1] and i > 1:
                linearReg.fit(X,Y)
                score = linearReg.score(X,Y)
                for game in games:
                    pred = linearReg.predict([[game]])
                    result = {
                            "player": player,
                            "game": game,
                            "score": score,
                            "prediction": pred[0][0]
                        }
                    results.append(result)
                player = row[1]
                i = 0
                y_sum = 0
                X = []
                Y = []


            X.append([i])
            y_sum = y_sum + row[2]
            Y.append([y_sum])
            i = i + 1

        self.log.info("Saving results to file")

        df = pd.DataFrame(data=results)
        df.to_csv(self.target_file, sep='|', index=False, header=False)
