const constants = {

  dataApiUrl : 'https://qgb6qyqmxb.execute-api.us-east-1.amazonaws.com/beta/statsgoon-data-api/v1/',

  solverApiUrl : 'https://zegyactk64.execute-api.us-east-1.amazonaws.com/statsgoon/solver/solve',

  positions : {
    goalie : 1,
    dmen : 2,
    fwd : 3
  },

  measures : [
      { key: 'points_total', text: 'Total Points', value: 'points_total' },
      { key: 'points_avg', text: 'Average Points', value: 'points_avg' },
      { key: 'points_ga_only', text: 'Goals & Assists', value: 'points_ga_only' },
      { key: 'points_wo_ga', text: 'Goals & Assists Excluded', value: 'points_wo_ga' },
      { key: 'last_10_total', text: 'Last 10 games', value: 'last_10_total' },
      { key: 'last_5_total', text: 'Last 5 games', value: 'last_5_total' },
      { key: 'last_3_total', text: 'Last 3 games', value: 'last_3_total' },
      { key: 'median', text: 'Median', value: 'median' }
  ]
}

export default constants
