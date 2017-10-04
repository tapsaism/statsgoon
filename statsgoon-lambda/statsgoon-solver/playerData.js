'use strict';
const promise = require('bluebird');

let options = {
  promiseLib: promise //override the pgp default ES6 promise with bluebird
};

const pgp = require('pg-promise')(options);

let dbConnString = process.env.DB_CONN_STR;

//let db = pgp('postgres://hockeygm:kissakala@pg-hockeygm.clespimdtvxb.eu-west-1.rds.amazonaws.com:5432/hockeygm');

let db = pgp(dbConnString);


module.exports.getData = function(teams, season, callback) {

  let variables = {};
  let binaries = {};

  let teamsArray = [];

  //convert the filter to array for the pgp
  teamsArray.push(teams);

  let query = `SELECT * FROM solver_data()
                  WHERE player IS NOT NULL
                  AND team IN ($1:csv)
                  AND season = '${season}'
                  AND value is not null`;

  db.query(query, teamsArray)
    .then(function(data) {

      data.forEach(function(element){
        variables[element.playername] = JSON.parse(JSON.stringify(element));
        binaries[element.playername] = 1;
      });

    })
    .catch(function(error) {
      console.log(error);
    })
    .finally(function(){
      console.log('Variables fetched');
      pgp.end();
      callback(variables, binaries);
    });

};
