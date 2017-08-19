'use strict';
const promise = require('bluebird');

let options = {
  promiseLib: promise //override the pgp default ES6 promise with bluebird
};

module.exports.getData = function(filter, callback) {

  const pgp = require('pg-promise')(options);

  let dbConnString = process.env.DB_CONN_STR;

  let db = pgp(dbConnString);

  let variables = {};
  let binaries = {};

  let teams = [];

  //convert the filter to array for the pgp
  teams.push(filter);

  //converts teams to lowercase
  let toLower = function(x) {
    return x.toLowerCase();
  }

  let teamsLower = teams.map(toLower);

  let query = `SELECT * FROM getPlayerData() WHERE player IS NOT NULL AND lower(team) IN ($1:csv)`;

  db.query(query, teamsLower)
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
