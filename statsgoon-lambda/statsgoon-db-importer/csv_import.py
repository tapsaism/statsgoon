from __future__ import print_function

import json, urllib, boto3
from src import importer

s3 = boto3.client('s3')

def import_csv(event, context):

 try:

  message = json.loads(event['Records'][0]['Sns']['Message'])
  bucket = message['Records'][0]['s3']['bucket']['name']
  key = message['Records'][0]['s3']['object']['key']

  print('Starting to import ', key, ' from ', bucket)

  response = s3.get_object(Bucket=bucket, Key=key)
  content = response['Body'].read().decode('utf-8')

  table_name = bucket.replace('-','_')

  return importer.import_file_to_pg(key,table_name,content)

 except Exception as e:
  print(e)
  raise e
