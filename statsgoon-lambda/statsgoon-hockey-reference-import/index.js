'use strict';

const aws = require('aws-sdk');
const pgp = require('pg-promise')();

let dbConnString = process.env.DB_CONN_STR;

let db = pgp(dbConnString);

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.s3handler = (event, context) => {
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '))
  const params = {
    Bucket: bucket,
    Key: key,
  }

  s3.getObject(params, (err, data) => {
    if (err)
      return `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`

    const fileName = params.Key
    const columns = ['file_name','insert_date', 'title', 'date', 'home_team',
                      'away_team', 'stat_type', 'player_id', 'player',
                      'measure', 'measure_value']
    let values = []

    var cs = new pgp.helpers.ColumnSet(
      columns,
      {table: 'hockeyreference_stats_all'}
    )

    const rows = data.Body.toString('utf-8').split("\n");

    console.log('Starting to loop file contents');

    rows.forEach((row, i) => {

      let vals = row.split('|');

      let valJson = {};

      if ((row.match(/-/g) || []).length < 5) {
        valJson = {
                file_name : fileName,
                insert_date : new Date().toISOString(),
                title : vals[0],
                date : vals[1],
                home_team : vals[2],
                away_team : vals[3],
                stat_type : vals[4],
                player_id : vals[5],
                player : vals[6],
                measure : vals[7],
                measure_value : vals[8]
              }
              values.push(valJson)
        }
    })

      const query = pgp.helpers.insert(values, cs)

      console.log('Saving to database')

      db.none(query)
          .then(data => {
              console.log('File import done ' + fileName)
            })
            .catch(error => {
              console.log('Error')
          });

      pgp.end()
    })
}
