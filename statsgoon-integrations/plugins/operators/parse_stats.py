import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from bs4 import BeautifulSoup as bs
import time
from datetime import datetime

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class ParseStatsOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 source_file_name='',
                 position='',
                 skater_target_file_name='',
                 goalie_target_file_name='',
                 *args, **kwargs):

        super(ParseStatsOperator, self).__init__(*args, **kwargs)
        self.source_file_name = source_file_name
        self.skater_target_file_name = skater_target_file_name
        self.goalie_target_file_name = goalie_target_file_name

    def execute(self, context):
        html = open(self.source_file_name, 'r')
        soup = bs(html)

        game = soup.title.string
        hyphen_index = game.find(' — ')
        pipe_index = game.find('|')
        at_index = game.find('at')
        bs_index = game.find('Box')
        game_date_str = game[hyphen_index+3:pipe_index-1]
        game_date = datetime.strptime(game_date_str, '%B %d, %Y')

        game_date = game_date.strftime('%Y-%m-%d')
        away = game[:at_index].strip()
        home = game[at_index+3:bs_index].strip()

        trs = soup.find_all('tr')

        skater_file = ''
        goalie_file =''

        current = [away,home]

        for tr in trs:
            tds = tr.find_all('td')
            if tds and (len(tds) == 17 or len(tds) == 9):
                if tds[0].text == 'TOTAL':
                    continue

                player_id = tds[0].find('a')['href'][11:].replace('.html','').strip()
                stat = '%s|%s|%s|%s' % (game_date, current[0], current[1], player_id)
                for td in tds:
                    stat += '|' + td.text

                stat += '\n'
                if len(tds) == 17:
                    skater_file += stat
                if len(tds) == 9:
                    goalie_file += stat

                if len(tds) == 9:
                    current = [home, away]

        skater_file = skater_file.rstrip()
        goalie_file = goalie_file.rstrip()

        with open(self.skater_target_file_name, 'w') as file:
         file.write(str(skater_file.rstrip()))

        with open(self.goalie_target_file_name, 'w') as file:
         file.write(str(goalie_file.rstrip()))

        self.log.info("Files saved %s and %s"
        % (self.skater_target_file_name, self.goalie_target_file_name))
