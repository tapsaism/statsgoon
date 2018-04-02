import boto3
import time, datetime

def none_to_empty(s):
 if s is None:
  return ''
 return str(s)

def save_to_s3(data,fileName,bucket):
 s3 = boto3.resource('s3')
 object = s3.Object(bucket, fileName)
 object.put(Body=data)

def timestamp(format):
 ts = time.time()
 timestamp = datetime.datetime.fromtimestamp(ts).strftime(format)
 return timestamp

def get_insert_statement(table,line):
 params_string = '%s,%s,'+','.join(map(lambda x: '%s', line.split('|')))
 statement = 'INSERT INTO staging.'+table+' VALUES ('+ params_string+')'
 return statement

def replace_in_list(list,old,new):
  return [x if x != old else new for x in list]
