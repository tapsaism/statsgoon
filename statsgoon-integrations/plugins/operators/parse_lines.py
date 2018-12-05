import json, codecs

from airflow.exceptions import AirflowException
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from bs4 import BeautifulSoup
import time
from datetime import datetime

ids = [
  'LW1','LW2','LW3','LW4',
  'RW1','RW2','RW3','RW4',
  'C1','C2','C3','C4',
  'RD1','RD2','RD3',
  'LD1','LD2','LD3',
  'PPLW1','PPRW1','PPC1','PPRD1','PPLD1',
  'PPLW2','PPRW2','PPC2','PPRD2','PPLD2',
  'G1','G2'
  ]

ts = time.time()
timestamp = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

class ParseLinesOperator(BaseOperator):

    ui_color = '#f4a460'

    @apply_defaults
    def __init__(self,
                 source_file_name='',
                 target_file_name='',
                 *args, **kwargs):

        super(ParseLinesOperator, self).__init__(*args, **kwargs)
        self.source_file_name = source_file_name
        self.target_file_name = target_file_name

    def execute(self, context):
        html = open(self.source_file_name,'r')
        soup = BeautifulSoup(html, 'html.parser')

        delimited_file = ''

        for id in ids:
         try:
          elem = soup.find('td', id=id)
          elem_val = elem.find('span', {"class":"player-name"}).text
          print(elem_val)
          line = timestamp + '|' + self.source_file_name + '|' + id + '|' + elem_val
          delimited_file += line + '\n'
         except:
          print('No player found')

        with open(self.target_file_name, 'w') as file:
            file.write(str(delimited_file.rstrip()))

        self.log.info("File saved %s" % self.target_file_name)
