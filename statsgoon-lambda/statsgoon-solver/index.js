'use strict';

const runSolver = require('./runSolver.js');

exports.lambdaSolver = (event, context, callback) => {

  console.log(event.ContentType);
  console.log(event.body);

  let filter = event.teams;
  let userConfig = {
    'value' : event.value,
    'measure' : event.measure,
    'goalie' : event.goalie,
    'def' : event.def,
    'fwd' : event.fwd
  };

  console.log(filter,userConfig);

  runSolver.executeSolver(filter, userConfig, function(result){
    console.log('Result Ready!');
    console.log(result);
    callback(null, result);
  });
};
