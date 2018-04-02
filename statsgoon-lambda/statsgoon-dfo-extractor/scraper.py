from __future__ import print_function

import json
import urllib
import boto3
from bs4 import BeautifulSoup
import time, datetime

s3 = boto3.client('s3')

def scrape_html(event, context):

 bucket = event['Records'][0]['s3']['bucket']['name']
 key = urllib.unquote_plus(event['Records'][0]['s3']['object']['key'].encode('utf8'))

 try:

  ts = time.time()
  timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

  delimited_file = ''

  response = s3.get_object(Bucket=bucket, Key=key)

  html = response['Body'].read().decode('utf-8')
  soup = BeautifulSoup(html, 'html.parser')

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

  print('Parsing file')

  for id in ids:
   elem = soup.find('td', id=id)
   elem_val = elem.find('span', {"class":"player-name"}).text
   line = timestamp + '|' + key + '|' + id + '|' + elem_val
   delimited_file += line + '\n'

  print('Saving file '+key+'.txt to S3')

  file_name = key[:-4] + '.txt'
  s3.put_object(Key= file_name, Body=delimited_file[:-1], Bucket = 'stg-dfo-lines')
  return file_name + ' stg-dfo-lines'

 except Exception as e:
  print(e)
  print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
  raise e
