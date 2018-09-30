const initialState =
  {
    selectedSeason: '2017-2018',
    selectedMeasure: 'points_total',
    goalieAmount: 1,
    dmenAmount: 2,
    fwdAmount: 3,
    teamValue: '2000000',
    solverLoading: '',
    solverResults: [],
    chartData: {
      dailyStats: [],
      latestStats: [],
      gamesLeft: []
    },
    loaderDescription: '',
    excludedPlayers: []
  }

const solver = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_SEASON':
      return {
          ...state,
          selectedSeason: action.selectedSeason
      }
      case 'UPDATE_SELECTED_MEASURE':
        return {
            ...state,
            selectedMeasure: action.selectedMeasure
        }
      case 'UPDATE_AMOUNT_GOALIES':
        return {
            ...state,
            goalieAmount: action.goalieAmount
        }
      case 'UPDATE_AMOUNT_DMEN':
        return {
            ...state,
            dmenAmount: action.dmenAmount
        }
      case 'UPDATE_AMOUNT_FORWARDS':
        return {
            ...state,
            fwdAmount: action.fwdAmount
        }
      case 'UPDATE_TEAM_VALUE':
        return {
            ...state,
            teamValue: action.teamValue
        }
      case 'UPDATE_EXCLUDED_PLAYERS':
        console.log(action)
        return {
            ...state,
            excludedPlayers: action.excludedPlayers
        }
      case 'LOADER_STATUS':
        return {
          ...state,
          solverLoading: action.loadingCharts,
          loaderDescription: action.desc
        }
      case 'UPDATE_SOLVER_RESULTS':
        return {
          ...state,
          solverResults: action.solverResults
        }
      case 'UPDATE_CHART_DATA':
        return {
          ...state,
          chartData: action.chartData
        }
      default:
        return state
  }
}

export default solver
