import Axios from 'axios'
import Constants from '../constants/Constants'
import Utils from '../utils/StatsgoonUtils'

const UPDATE_SELECTED_SEASON = 'UPDATE_SELECTED_SEASON'
const UPDATE_SELECTED_MEASURE = 'UPDATE_SELECTED_MEASURE'
const UPDATE_AMOUNT_GOALIES = 'UPDATE_AMOUNT_GOALIES'
const UPDATE_AMOUNT_DMEN = 'UPDATE_AMOUNT_DMEN'
const UPDATE_AMOUNT_FORWARDS = 'UPDATE_AMOUNT_FORWARDS'
const UPDATE_TEAM_VALUE = 'UPDATE_TEAM_VALUE'
const LOADER_STATUS = 'LOADER_STATUS'
const UPDATE_SOLVER_RESULTS = 'UPDATE_SOLVER_RESULTS'
const UPDATE_CHART_DATA = 'UPDATE_CHART_DATA'
const UPDATE_EXCLUDED_PLAYERS = 'UPDATE_EXCLUDED_PLAYERS'

export function updateExcludedPlayers(players) {
  return (
    {
      type: UPDATE_EXCLUDED_PLAYERS,
      excludedPlayers: players
    }
  )
}

export function updateSeason(season) {
  return (
    {
      type: UPDATE_SELECTED_SEASON,
      selectedSeason: season
    }
  )
}

export function updateMeasure(measure) {
  return (
    {
      type: UPDATE_SELECTED_MEASURE,
      selectedMeasure: measure
    }
  )
}

export function amountGoalie(goalieAmount) {
  return (
    {
      type: UPDATE_AMOUNT_GOALIES,
      goalieAmount: goalieAmount
    }
  )
}

export function amountDmen(dmenAmount) {
  return (
    {
      type: UPDATE_AMOUNT_DMEN,
      dmenAmount: dmenAmount
    }
  )
}

export function amountForwards(fwdAmount) {
  return (
    {
      type: UPDATE_AMOUNT_FORWARDS,
      fwdAmount: fwdAmount
    }
  )
}

export function teamValue(teamValue) {
  return (
    {
      type: UPDATE_TEAM_VALUE,
      teamValue: teamValue
    }
  )
}

export function solverLoading(state, desc) {
  return (
    {
      type: LOADER_STATUS,
      loadingCharts: state,
      desc: desc
    }
  )
}

export function updateSolverResults(results) {
  return (
    {
      type: UPDATE_SOLVER_RESULTS,
      solverResults: results
    }
  )
}

export function updateChartData(results) {
  return (
    {
      type: UPDATE_CHART_DATA,
      chartData: results
    }
  )
}

export function runSolver() {
  return(dispatch, getState) => {

    dispatch(solverLoading('active','Running Statsgoon Solver'))

    console.log(getState().solver.excludedPlayers)

    let teams = getState().teams.selectedTeams[0] === 'all'
                  ? Constants.teams
                  : getState().teams.selectedTeams

    let excluded = getState().solver.excludedPlayers.length === 0
                  ? ['None']
                  : getState().solver.excludedPlayers

    console.log(excluded)

    let solverParams = {
      "filter":{
          "teams": teams,
          "excluded": excluded,
          "measure":getState().solver.selectedMeasure,
          "def": getState().solver.dmenAmount,
          "fwd": getState().solver.fwdAmount,
          "goalie": getState().solver.goalieAmount,
          "value": getState().solver.teamValue.replace(/\s/g,''),
          "season": getState().solver.selectedSeason
    }
  }

    return Axios.post(Constants.solverApiUrl, solverParams)
      .then((response) => {
        console.log(response.data)
        dispatch(updateSolverResults(response.data))
        dispatch(solverLoading('disabled',''))
    })
  }
}

export function getChartData(params) {
  return(dispatch) => {
    dispatch(solverLoading('active','Rendering charts'))
    return Axios.all([
       Axios.post(Constants.dataApiUrl+'player/daily-stats',params),
       Axios.post(Constants.dataApiUrl+'player/all-stats',params),
       Axios.post(Constants.dataApiUrl+'player/games-left',params)
      ])
    .then(Axios.spread((daily,latest,games) =>  {
       dispatch(updateChartData({'dailyStats': daily.data,'latestStats': latest.data,'gamesLeft': games.data}))
       dispatch(solverLoading('disabled',''))
    }))
  }
}

export function runSolverAndGetChartData() {
  return (dispatch, getState) => {
    return dispatch(runSolver())
            .then(() => {
              const chartParams = {
              filter: [
                  Utils.parsePlayers(getState().solver.solverResults.body),
                  getState().solver.selectedSeason
                ]
              }
            return dispatch(getChartData(chartParams))
    })
  }
}
