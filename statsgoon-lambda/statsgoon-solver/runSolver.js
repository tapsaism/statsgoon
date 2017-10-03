'use strict';
const async = require('async');
const hockeySolver = require('./hockeySolver');
const playerData = require('./playerData');

module.exports.executeSolver = function (teams, season, userConfig, callback){

async.waterfall([
  getData,
  solve
], function(err, result) {
  callback(result);
});

function getData(callback) {
  console.log('Fetching data for solver');
  playerData.getData(teams,season,function(variables,binaries) {
    callback(null,variables,binaries);
  });
};

function solve(variables, binaries, callback) {

  console.log('Data received, configuring solver');

  let modelConfig = {
    'variables': variables,
    'binaries': binaries,
    'optimize': userConfig.measure,
    'maxValue' : userConfig.value,
    'gamesplayed' : {"min": 120},
    'goalie' : userConfig.goalie,
    'def' : userConfig.def,
    'fwd' : userConfig.fwd
  };

  hockeySolver.solve(modelConfig, function(result){
    callback(null,result);
  });
};

};
