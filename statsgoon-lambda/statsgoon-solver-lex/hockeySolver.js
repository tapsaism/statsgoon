'use strict';

const solver = require('./src/solver.js');

let model = {
    "optimize": "points_total",
    "opType": "max",
    "constraints": {
        "value": {"max": 2000000},
        "goalie": {"equal": 1},
        "forward": {"equal": 3},
        "defence": {"equal": 2},
        "player": {"equal":6}
    }
};

module.exports.solve = function(config, callback) {

  console.log('Starting to solve');

  model['variables'] = config.variables;
  model['binaries'] = config.binaries;
  model.optimize = config.optimize;
  model.constraints.value.max = config.maxValue;
  model.constraints.goalie.equal = config.goalie;
  model.constraints.defence.equal = config.def;
  model.constraints.forward.equal = config.fwd;
  model.constraints.player.equal = parseInt(config.goalie) + parseInt(config.def) + parseInt(config.fwd);

  console.log(model.constraints);

  let result = solver.Solve(model);

  callback(result);

}
