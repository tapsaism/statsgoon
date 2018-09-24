const constants = {

  dataApiUrl : process.env.REACT_APP_DATA_API_URL,

  solverApiUrl : process.env.REACT_APP_SOLVER_API_URL,

  positions : {
    goalie : 1,
    dmen : 2,
    fwd : 3
  },

  teams: [
    'Anaheim','Arizona','Boston','Buffalo','Calgary','Carolina','Chicago',
    'Colorado','Columbus','Dallas','Detroit','Edmonton','Florida','Los Angeles',
    'Minnesota','Montreal','Nashville','New Jersey','NY Islanders','NY Rangers',
    'Ottawa','Philadelphia','Pittsburgh','San Jose','St. Louis','Tampa Bay',
    'Toronto','Vancouver','Vegas','Washington','Winnipeg'
  ],

  measures : [
      { key: 'points_total', text: 'Total Points', value: 'points_total' },
      { key: 'points_avg', text: 'Average Points', value: 'points_avg' },
      { key: 'points_ga_only', text: 'Goals & Assists', value: 'points_ga_only' },
      { key: 'points_wo_ga', text: 'Goals & Assists Excluded', value: 'points_wo_ga' },
      { key: 'last_10_total', text: 'Last 10 games', value: 'last_10_total' },
      { key: 'last_5_total', text: 'Last 5 games', value: 'last_5_total' },
      { key: 'last_3_total', text: 'Last 3 games', value: 'last_3_total' },
      { key: 'median', text: 'Median', value: 'median' }
  ],

  marks : {
    0 : '1',
    25 : '',
    29 : '2',
    67 : '',
    71 : '3',
    113: '',
    119: '4',
    151: '',
    155: '5',
    185: '',
    189: '6',
    240: ''
  },

  seasons : [
    {text: '2018-2019', value: '2018-2019'},
    {text: '2017-2018', value: '2017-2018'},
    {text: '2016-2017', value: '2016-2017'}
  ],

  colors : [
    '#B03060',
    '#FE9A76',
    '#FFD700',
    '#32CD32',
    '#016936',
    '#008080',
    '#0E6EB8',
    '#EE82EE',
    '#B413EC',
    '#FF1493',
    '#A52A2A',
    '#A0A0A0',
    '#000000'
  ]

}

export default constants
