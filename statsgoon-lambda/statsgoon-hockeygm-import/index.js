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

              let valJson = {};
              if ((row.match(/-/g) || []).length < 5) {
                if (playerType === 'g') {
                  valJson = {
                    insertdate : new Date().toISOString(),
                    filedate : vals[1],
                    team : vals[3],
                    name : vals[2],
                    games : vals[5],
                    goals : vals[6],
                    assists : vals[7],
                    points : vals[8],
                    wins : vals[9],
                    losses : vals[10],
                    ot_losses : vals[11],
                    saves : vals[12],
                    allowed_goals : vals[13],
                    shutouts : vals[14],
                    penalties : vals[15],
                    three_stars : vals[16],
                    two_stars : vals[17],
                    one_stars : vals[18],
                    hgm_avg : vals[19],
                    hgm_total : vals[20],
                    hgm_value : vals[21]
                  }
                  values.push(valJson);
                }
                else {
                  valJson = {
                    insertdate : new Date().toISOString(),
                    filedate : vals[1],
                    team : vals[3],
                    name : vals[2],
                    games : vals[5],
                    goals : vals[6],
                    assists : vals[7],
                    points : vals[8],
                    shg_goals : vals[9],
                    shg_assists : vals[10],
                    gw_goals : vals[11],
                    ot_goals : vals[12],
                    shots : vals[13],
                    hits : vals[14],
                    blocks : vals[15],
                    fo_wins : vals[16],
                    fo_losses : vals[17],
                    plusminus : vals[18],
                    penaltymin : vals[19],
                    three_stars : vals[20],
                    two_stars : vals[21],
                    one_stars : vals[22],
                    hgm_avg : vals[23],
                    hgm_total : vals[24],
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
