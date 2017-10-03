'use strict';

const runSolver = require('./runSolver.js');

exports.lambdaSolver = (event, context, callback) => {

  console.log(event.ContentType)
  console.log(event.body)

  let teams = event.teams
  let season = event.season
  let userConfig = {
    'value' : event.value,
    'measure' : event.measure,
    'goalie' : event.goalie,
    'def' : event.def,
    'fwd' : event.fwd
  };

  console.log(teams,season,userConfig);

  runSolver.executeSolver(teams, season, userConfig, function(result){
    console.log('Result Ready!');
    console.log(result);
    callback(null, result);
  });
};
