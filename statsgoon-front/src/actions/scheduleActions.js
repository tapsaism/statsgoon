import Axios from 'axios'
import Constants from '../constants/Constants'
import Utils from '../utils/StatsgoonUtils'

const GET_SCHEDULE = 'GET_SCHEDULE'
const UPDATE_SCHEDULE_STATUS = 'UPDATE_SCHEDULE_STATUS'
const SET_RANGE = 'SET_RANGE'
const GET_SCHEDULE_TODAY = 'GET_SCHEDULE_TODAY'
const GET_TEAM_STATS = 'GET_TEAM_STATS'

export function loadSchedule() {
  return(dispatch) => {
    dispatch(scheduleLoadingState('active'))
    return Axios.get(Constants.dataApiUrl+'team/schedule-current-period')
      .then((response) => {
        dispatch(setSchedule(response.data))
        dispatch(scheduleLoadingState('disabled'))
      })
  }
}

export function loadScheduleToday() {
  return(dispatch) => {
    dispatch(scheduleLoadingState('active'))
    return Axios.get(Constants.dataApiUrl+'schedule/today')
      .then((response) => {
        dispatch(setScheduleToday(response.data))
        dispatch(scheduleLoadingState('disabled'))
      })
  }
}

export function loadTeamStats(team,opponent) {
  return(dispatch) => {
    let queryFilter = [team, opponent]
    return Axios.post(Constants.dataApiUrl+'team/game_results', queryFilter)
        .then((response) => {
          dispatch()
        })
    }
}

export function loadScheduleWithParams(value) {

  let params = {
    filter: [
      Utils.addDays(value[0]),
      Utils.addDays(value[1])
    ]
  }

  return(dispatch) => {
    dispatch(setRange(value))
    dispatch(scheduleLoadingState('active'))
    return Axios.post(Constants.dataApiUrl+'team/schedule-with-params', params).then((response) => {
      dispatch(setSchedule(response.data))
      dispatch(scheduleLoadingState('disabled'))
    })
  }
}

export function scheduleLoadingState(state) {
  return (
    {
      type: UPDATE_SCHEDULE_STATUS,
      loading: state
    }
  )
}

export function setSchedule(data) {
  return (
    {
      type: GET_SCHEDULE,
      scheduleData: data
   }
  )
}

export function setScheduleToday(data) {
  return (
    {
      type: GET_SCHEDULE_TODAY,
      scheduleTodayData: data
   }
  )
}

export function setRange(range) {
  return (
    {
      type: SET_RANGE,
      range: range
    }
  )
}

export function getTeamTeamStats(results) {
  return {
    type: GET_TEAM_STATS,
    gameResults: results
  }
}
