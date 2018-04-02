import boto3
import time, datetime

def NoneToEmpty(s):
  if s is None:
    return ''
  return str(s)

def SaveToS3(data,fileName,bucket):
  s3 = boto3.resource('s3')
  object = s3.Object(bucket, fileName)
  object.put(Body=data)

def timestamp(format):
  ts = time.time()
  timestamp = datetime.datetime.fromtimestamp(ts).strftime(format)
  return timestamp
