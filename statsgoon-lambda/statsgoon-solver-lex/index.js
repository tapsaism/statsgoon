'use strict';

const runSolver = require('./runSolver.js');

exports.lambdaSolver = (event, context, callback) => {

  console.log(event);

  let filter = event.currentIntent.slots.teams;
  let userConfig = {
    'value' : event.currentIntent.slots.value,
    'measure' : event.currentIntent.slots.measure,
    'goalie' : event.currentIntent.slots.goalie,
    'def' : event.currentIntent.slots.def,
    'fwd' : event.currentIntent.slots.fwd
  };

  console.log(filter,userConfig);

  runSolver.executeSolver(filter, userConfig, function(result){
    console.log('Result Ready!');
    console.log(result);

    var reply = {"dialogAction" : {
                  "type": "Close",
                  "fulfillmentState": "Fulfilled",
                  "message": {
                    "contentType": "PlainText",
                    "content": JSON.stringify(result)
                  }
                }
              };

    console.log(reply);

    callback(null, reply);
  });
};
