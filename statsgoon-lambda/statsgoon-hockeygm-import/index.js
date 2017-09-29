'use strict';

const aws = require('aws-sdk');
const pgp = require('pg-promise')();

let dbConnString = process.env.DB_CONN_STR;

let db = pgp(dbConnString);

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.s3handler = (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(params, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {

            console.log('FILE NAME', params.Key);
            console.log('FILE CONTENT TYPE:', data.ContentType);

            let fileName = params.Key;
            let playerType = fileName.substr(3,1);

            let tables = {
              f: 'hockeygm_stats_f',
              d: 'hockeygm_stats_d',
              g: 'hockeygm_stats_g'
            }

            let columns = {
              f: ['insertdate', 'filedate', 'team', 'name', 'games', 'goals', 'assists', 'points', 'shg_goals', 'shg_assists', 'gw_goals', 'ot_goals', 'shots', 'hits', 'blocks', 'fo_wins', 'fo_losses', 'plusminus', 'penaltymin', 'three_stars', 'two_stars', 'one_stars', 'hgm_avg', 'hgm_total', 'hgm_value'],
              d: ['insertdate', 'filedate', 'team', 'name', 'games', 'goals', 'assists', 'points', 'shg_goals', 'shg_assists', 'gw_goals', 'ot_goals', 'shots', 'hits', 'blocks', 'fo_wins', 'fo_losses', 'plusminus', 'penaltymin', 'three_stars', 'two_stars', 'one_stars', 'hgm_avg', 'hgm_total', 'hgm_value'],
              g: ['insertdate', 'filedate', 'team', 'name', 'games', 'goals', 'assists', 'points', 'wins', 'losses', 'ot_losses', 'saves', 'allowed_goals', 'shutouts', 'penalties', 'three_stars', 'two_stars', 'one_stars', 'hgm_avg', 'hgm_total', 'hgm_value']
            }


            let values = [];

            var cs = new pgp.helpers.ColumnSet(
                  columns[playerType],
                  {table: tables[playerType]}
                );

            let rows = data.Body.toString('utf-8').split("\n");

            console.log('Starting to loop file contents');

            rows.forEach(function(row, i){

              let vals = row.split('|');

              console.log(vals.length)

              let valJson = {};
              if (vals.length > 20) {
                if (playerType === 'g') {
                  valJson = {
                    insertdate : new Date().toISOString(),
                    filedate : vals[1],
                    team : vals[3],
                    name : vals[2],
                    games : vals[5].replace('-',0),
                    goals : vals[6].replace('-',0),
                    assists : vals[7].replace('-',0),
                    points : vals[8].replace('-',0),
                    wins : vals[9].replace('-',0),
                    losses : vals[10].replace('-',0),
                    ot_losses : vals[11].replace('-',0),
                    saves : vals[12].replace('-',0),
                    allowed_goals : vals[13].replace('-',0),
                    shutouts : vals[14].replace('-',0),
                    penalties : vals[15].replace('-',0),
                    three_stars : vals[16].replace('-',0),
                    two_stars : vals[17].replace('-',0),
                    one_stars : vals[18].replace('-',0),
                    hgm_avg : vals[19].replace('-',0),
                    hgm_total : vals[20].replace('-',0),
                    hgm_value : vals[21].replace('-',0)
                  }
                  values.push(valJson);
                }
                else {
                  valJson = {
                    insertdate : new Date().toISOString(),
                    filedate : vals[1],
                    team : vals[3],
                    name : vals[2].replace('-',0),
                    games : vals[5].replace('-',0),
                    goals : vals[6].replace('-',0),
                    assists : vals[7].replace('-',0),
                    points : vals[8].replace('-',0),
                    shg_goals : vals[9].replace('-',0),
                    shg_assists : vals[10].replace('-',0),
                    gw_goals : vals[11].replace('-',0),
                    ot_goals : vals[12].replace('-',0),
                    shots : vals[13].replace('-',0),
                    hits : vals[14].replace('-',0),
                    blocks : vals[15].replace('-',0),
                    fo_wins : vals[16].replace('-',0),
                    fo_losses : vals[17].replace('-',0),
                    plusminus : vals[18].replace('-',0),
                    penaltymin : vals[19].replace('-',0),
                    three_stars : vals[20].replace('-',0),
                    two_stars : vals[21].replace('-',0),
                    one_stars : vals[22].replace('-',0),
                    hgm_avg : vals[23].replace('-',0),
                    hgm_total : vals[24].replace('-',0),
                    hgm_value : vals[25]
                  }
                  values.push(valJson);
                }
          }
          });

            let query = pgp.helpers.insert(values, cs);

            console.log('Saving to database');

            //Change this to db many to get the insert stats
            db.none(query)
                .then(data => {
                    console.log('New rows inserted', data);
                })
                .catch(error => {
                    console.log(error);
                });

          pgp.end();
        }
    });
};
