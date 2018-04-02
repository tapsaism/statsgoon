'use strict';

console.log('Loading function');

const aws = require('aws-sdk');
const cheerio = require('cheerio');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.s3handler = (event, context, callback) => {

    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };

    console.log('getting the object from s3');

    s3.getObject(params, (err, data) => {

        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message, null);
        } else {


            let fileName = params.Key;

            console.log('FILE NAME', params.Key);
            console.log('FILE CONTENT TYPE:', data.ContentType);

            let $ = cheerio.load(data.Body);

            let row;
            let loadDate = new Date().toISOString();
            let fileDate = fileName.substr(7,8);


            console.log('File date: ', fileDate);

            let oddRows = $('tr.odd');
            let evenRows = $('tr.even');

            //Combine rows by turning them into arrays and concatting
            let oddArr = Object.keys(oddRows).map(function (key) { return oddRows[key]; });
            let evenArr = Object.keys(evenRows).map(function (key) { return evenRows[key]; });
            let allArr = oddArr.concat(evenArr);

            console.log('Rows combined');

            let forwards = '';
            let defensemen = '';
            let goalies = '';

            console.log('Starting to loop rows');

            allArr.forEach(function(element,i){

              if ($(element).html() === null || element.type != 'tag')
                return;

              row = '';

              //Get html elements
              let rowHtml = $(element);
              let stats = rowHtml.find('td.stat_data');
              let nameData = rowHtml.find('td.name_data');

              //Parse name and team
              let nameTeamStr = $(nameData.children()[0]).attr('title');
              let indStart = nameTeamStr.indexOf('(');
              let indEnd = nameTeamStr.length-indStart-2;
              let team = nameTeamStr.substr(indStart+1,indEnd);
              let playerName = nameTeamStr.substr(0,indStart-1);

              //Parse position
              let positionData = $(nameData.children()[1]).attr('class');
              let position = positionData.substr(0,positionData.indexOf('_'));

              //Start adding columns to rows
              row = loadDate + '|';
              row += fileDate + '|';
              row += playerName + '|';
              row += team + '|';
              row += position + '|';

              stats.each(function(i, element){
                let val = $(this);
                val = val.text();
                row += val+ '|';
              });

              let playerVal = rowHtml.find('td.essential.persist.value_data').text();
              row += playerVal + '\n';

              //console.log(i);

              //if there are more than 3 hyphens on the row, the filter it out
            //  if ((row.match(/-/g) || []).length > 5)
            //    return;
              //add to goalies
              if (position === 'goalie') {
                goalies += row;
                return;
              }
              //filter out icon_injury (injured players) [icon_injury values is in the position column]
              if (position === 'forward') {
                forwards += row;
                return;
              }
              //
              if (position === 'defenseman') {
                defensemen += row;
                return;
              }

            });

            let goaliesFile = `gm_g_${fileDate}.txt`;
            let forwardsFile = `gm_f_${fileDate}.txt`;
            let defensemenFile = `gm_d_${fileDate}.txt`;

            console.log(forwards)

            console.log(goaliesFile, forwardsFile, defensemenFile);

            s3.putObject({ Bucket: 'statsgoon-txt', Key: forwardsFile, Body: forwards }, function(err, data) {
              console.log('Error: ', err);
              console.log(forwardsFile, 'uploaded'); // File uploads correctly.
            });

            s3.putObject({ Bucket: 'statsgoon-txt', Key: defensemenFile, Body: defensemen }, function(err, data) {
              console.log('Error: ', err);
              console.log(defensemenFile, 'uploaded'); // File uploads correctly.
            });

            s3.putObject({ Bucket: 'statsgoon-txt', Key: goaliesFile, Body: goalies }, function(err, data) {
              console.log('Error: ', err);
              console.log(goaliesFile, 'uploaded'); // File uploads correctly.
            });

            s3.putObject({ Bucket: 'stg-hgm-forwards', Key: forwardsFile, Body: forwards }, function(err, data) {
              console.log('Error: ', err);
              console.log(forwardsFile, 'uploaded'); // File uploads correctly.
            });

            s3.putObject({ Bucket: 'stg-hgm-dmen', Key: defensemenFile, Body: defensemen }, function(err, data) {
              console.log('Error: ', err);
              console.log(defensemenFile, 'uploaded'); // File uploads correctly.
            });

            s3.putObject({ Bucket: 'stg-hgm-goalies', Key: goaliesFile, Body: goalies }, function(err, data) {
              console.log('Error: ', err);
              console.log(goaliesFile, 'uploaded'); // File uploads correctly.
            });

            callback(null, 'All Done!');
        }
    });
};
