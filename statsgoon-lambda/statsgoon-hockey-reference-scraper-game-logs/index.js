'use strict'
const aws = require('aws-sdk');
const scraper = require('./src/hockey-reference-scraper')

exports.s3handler = (event, context, callback) => {

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {  Bucket: bucket, Key: key };

  const s3 = new aws.S3({ apiVersion: '2006-03-01' });

  console.log(params)

  s3.getObject(params, (err, data) => {

    if(err)
      callback(`Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`, null);

    const gamestats = scraper.scrapeGameStats(data.Body)

    s3.putObject({ Bucket: 'hockey-reference-game-log-txt', Key: key+'.txt', Body: gamestats }, function(err, data) {
      callback(null, key+'.txt file created')
    });
  })
}
