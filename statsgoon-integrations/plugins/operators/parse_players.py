import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from bs4 import BeautifulSoup
import time
from datetime import datetime

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class ParsePlayersOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 source_file_name='',
                 target_file_name='',
                 position='',
                 *args, **kwargs):

        super(ParsePlayersOperator, self).__init__(*args, **kwargs)
        self.source_file_name = source_file_name
        self.target_file_name = target_file_name
        self.position = position

    def execute(self, context):
        html = open(self.source_file_name,'r')
        soup = BeautifulSoup(html)

        odd = soup.findAll('tr', {'class':'odd'})
        even = soup.findAll('tr', {'class':'even'})
        merged = odd + even

        delimited_file = ''
        file_date = self.source_file_name[10:20].replace('-','')

        for tr in merged:
         if tr.find('td', {'class':'name_data'}):
          player_team = tr.find('td', {'class':'name_data'}).find('a').get('title')
          player = player_team[:player_team.find('(')-1]
          team = player_team[player_team.find('(')+1:player_team.find(')')]
          position = tr.find('td', {'class':'name_data'}).find('input').get('class')[0].split('_')[0]
          value = tr.find('td', {'class':'value_data'}).text
          stats = tr.findAll('td', {"class":"stat_data"})

          line = '%s|%s|%s|%s|%s' % (timestamp, file_date, player, team, position)

          for stat in stats:
           val = stat.text
           if val == '-':
               val= 0
           line += '|' + str(val)

          line += '|' + value

          print(position, self.position)

          if position == self.position:
           delimited_file += line + '\n'

        with open(self.target_file_name, 'w') as file:
         file.write(str(delimited_file.rstrip()))

        self.log.info("File saved %s" % self.target_file_name)
