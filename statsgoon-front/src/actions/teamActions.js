import Axios from 'axios'
import Constants from '../constants/Constants'

const GET_TEAMS_AND_GAMES = 'GET_TEAMS_AND_GAMES'
const UPDATE_TEAMS_PARAM_STATUS = 'UPDATE_TEAMS_PARAM_STATUS'
const GET_TEAMS_WITH_POINTS = 'GET_TEAMS_WITH_POINTS'
const UPDATE_SELECTED_TEAMS = 'UPDATE_SELECTED_TEAMS'

export function loadTeams() {
  return(dispatch) => {
    dispatch(teamsLoadingState(true))
    return Axios.get(Constants.dataApiUrl+'team/games-left')
      .then((response) => {
        dispatch(getTeams(response.data))
        dispatch(teamsLoadingState(false))
      })
  }
}

export function teamsLoadingState(state) {
  return (
    {
      type: UPDATE_TEAMS_PARAM_STATUS,
      loading: state
    }
  )
}

export function getTeams(data) {
  return (
    {
      type: GET_TEAMS_AND_GAMES,
      teamData: data
   }
  )
}

export function loadTeamsWithPoints(filterArray) {
  return(dispatch) => {
    dispatch(teamsLoadingState(true))
    return Axios.all([
      Axios.post(Constants.dataApiUrl+'team/points',filterArray[0]),
      Axios.post(Constants.dataApiUrl+'team/points',filterArray[1]),
      Axios.post(Constants.dataApiUrl+'team/points',filterArray[2]),
      Axios.post(Constants.dataApiUrl+'team/points',filterArray[3])
      ])
    .then(Axios.spread((all,goalies,dmen,fwds) =>  {
      dispatch(getTeamsWithPoints(all,goalies,dmen,fwds))
      dispatch(teamsLoadingState(false))
    }))
  }
}

export function getTeamsWithPoints(all,goalies,dmen,fwds) {
  return (
    {
      type: GET_TEAMS_WITH_POINTS,
      allPositions: all.data,
      goalies: goalies.data,
      dmen: dmen.data,
      fwds: fwds.data
    }
  )
}

export function updateSelectedTeams(teams) {
  return {
    type: UPDATE_SELECTED_TEAMS,
    selectedTeams: teams
  }
}
