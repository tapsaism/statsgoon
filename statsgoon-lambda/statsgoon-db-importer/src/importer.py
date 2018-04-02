import csv
import psycopg2
import os

import utils

def import_file_to_pg(filename,table_name,data):

  conn_str = os.environ['DB_CONN_STR']

  conn = psycopg2.connect(conn_str)
  cur = conn.cursor()

  lines = data.split(b'\n')

  statement = utils.get_insert_statement(table_name,lines[0])
  timestamp = utils.timestamp('%Y-%m-%d')

  default_cols = [timestamp,filename]

  for line in lines:
   if len(line) > 0:
    orig_values = line.split('|')
    insert_values = default_cols + utils.replace_in_list(orig_values,'-','0')
    cur.execute(statement,insert_values)
  conn.commit()

  return filename +' imported to db'
