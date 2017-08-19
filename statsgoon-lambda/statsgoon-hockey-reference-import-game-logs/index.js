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
    const columns = ['file_name','insert_date', 'title', 'date_of_birth', 'position',
                      'salary', 'caphit', 'rank', 'measure', 'measure_value']
    let values = []

    var cs = new pgp.helpers.ColumnSet(
      columns,
      {table: 'hockeyreference_player_game_logs'}
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
                date_of_birth : vals[1],
                position : vals[2],
                salary : vals[3],
                caphit : vals[4],
                rank : vals[5],
                measure : vals[6],
                measure_value : vals[7]
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
              console.log(fileName + ' ERROR: ' + error)
          });

      pgp.end()
    })
}
