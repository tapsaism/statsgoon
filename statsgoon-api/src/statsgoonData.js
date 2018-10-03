'use strict'
const queries = require('./db/querySolver')
const hockeySolver = require('./solver/hockeySolver')
const db = require('./db/db.js')

module.exports.getData = (req, res) => {

  let queryFilter = !req.body.filter ? [] : req.body.filter
  let query = queries.getQueryByRequestType(req.route.path)

  console.info(req.route.path, query, queryFilter)

  db.query(query, queryFilter)
  .then((data) => {
    console.info("Success fetching data")
    return res.send(data)
  })
  .catch((error) => {
    console.info("Error requesting data")
    console.error(error)
    return res.send(error)
  })
}

module.exports.runSolver = (req, res) => {

  let queryFilter = [
    req.body.filter.teams,
    req.body.filter.season,
    req.body.filter.excluded
  ]
  
  let query = queries.getQueryByRequestType('/solver')

  console.info(query,queryFilter)

  db.query(query, queryFilter)
  .then((data) => {

    let variables = {}
    let binaries = {}

    data.forEach(item => {
      variables[item.playername] = JSON.parse(JSON.stringify(item))
      binaries[item.playername] = 1
    })

    let modelConfig = {
      'variables': variables,
      'binaries': binaries,
      'optimize': req.body.filter.measure,
      'maxValue' : req.body.filter.value,
      'gamesplayed' : {"min": 120},
      'goalie' : req.body.filter.goalie,
      'def' : req.body.filter.def,
      'fwd' : req.body.filter.fwd
    }

    hockeySolver.solve(modelConfig, (result) => {
      console.info("Success")
      console.info(result)
      let response = {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin": "*"
        },
        "body": result
      }
      return res.send(response)
    })
  })
  .catch((error) => {
    console.info(error)
    return res.send(error)
  })

}
