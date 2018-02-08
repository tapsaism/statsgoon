import Axios from 'axios'
import Constants from '../constants/Constants'

const GET_PLAYERS_ALL_POSITIONS = 'GET_PLAYERS_ALL_POSITIONS'
const UPDATE_PLAYER_PARAM_STATUS = 'UPDATE_PLAYER_PARAM_STATUS'
const ADD_GOALIES = 'ADD_GOALIES'
const ADD_DMEN = 'ADD_DMEN'
const ADD_FORWARDS = 'ADD_FORWARDS'
const GET_TOP_PLAYERS_BY_TEAM = 'GET_TOP_PLAYERS_BY_TEAM'
const TOP_PLAYER_LOADING_STATE = 'TOP_PLAYER_LOADING_STATE'

export function loadAllPlayers() {
  return(dispatch) => {
    dispatch(playerLoadingState(true))
    return Axios.get(Constants.dataApiUrl+'player/all-players')
      .then((response) => {
        dispatch(getPlayers(response.data))
        dispatch(playerLoadingState(false))
      })
  }
}

export function addGoalies(goalies) {
  return (
    {
      type: ADD_GOALIES,
      selectedGoalies: goalies
    }
  )
}

export function addDmen(dmen) {
  return (
    {
      type: ADD_DMEN,
      selectedDmen: dmen
    }
  )
}

export function addForwards(forwards) {
  return (
    {
      type: ADD_FORWARDS,
      selectedForwards: forwards
    }
  )
}

export function playerLoadingState(state) {
  return (
    {
      type: UPDATE_PLAYER_PARAM_STATUS,
      loading: state
    }
  )
}

export function getPlayers(data) {
  return (
    {
      type: GET_PLAYERS_ALL_POSITIONS,
      playerData: data
   }
  )
}

export function topPlayerLoadingState(state) {
  return (
    {
      type: TOP_PLAYER_LOADING_STATE,
      topPlayerLoading: state
    }
  )
}

export function loadTopPlayersByTeam(filterArray) {
  return(dispatch) => {
    dispatch(topPlayerLoadingState(true))
    return Axios.all([
      Axios.post(Constants.dataApiUrl+'player/top-players',filterArray[0]),
      Axios.post(Constants.dataApiUrl+'player/top-players',filterArray[1]),
      Axios.post(Constants.dataApiUrl+'player/top-players',filterArray[2]),
      Axios.post(Constants.dataApiUrl+'player/top-players',filterArray[3])
      ])
    .then(Axios.spread((all,goalies,dmen,fwds) =>  {
      dispatch(getTopPlayersByTeam(all,goalies,dmen,fwds))
      dispatch(topPlayerLoadingState(false))
    }))
  }
}

export function getTopPlayersByTeam(all,goalies,dmen,fwds) {
  return (
    {
      type: GET_TOP_PLAYERS_BY_TEAM,
      allPositions: all.data,
      goalies: goalies.data,
      dmen: dmen.data,
      fwds: fwds.data
    }
  )
}
