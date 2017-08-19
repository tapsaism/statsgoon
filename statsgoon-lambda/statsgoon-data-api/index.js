'use strict'

const statsgoonData = require('./src/statsgoonData')

exports.getDataByRequestType = (event, context, callback) => {

  context.callbackWaitsForEmptyEventLoop = false

  let filter = event.body ? JSON.parse(event.body).filter : null
  let requestPath = event.pathParameters.proxy

  console.info(event)
  console.info(requestPath)
  console.info(filter)

  statsgoonData.getData(filter,requestPath)
    .then((data) => {
      console.info('SUCCESS:', data)
      let response = {
        "statusCode": 200,
        "body": JSON.stringify(data)
        }
      callback(null, response)
    })
    .catch((error) => {
      console.error('ERROR:', error)
      callback(error, null)
    })
}
