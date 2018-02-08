import Utils from '../utils/StatsgoonUtils'

const initialState =
  {
    teamSchedules: [],
    rangeDefaultValue: [Utils.dateDiff(new Date('2017-10-04'), new Date()), Utils.periodEnd()],
    scheduleLoading: 'active'
  }

const schedule = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SCHEDULE':
      return {
        ...state,
        teamSchedules: action.scheduleData
      }
    case 'UPDATE_SCHEDULE_STATUS':
      return {
        ...state,
        scheduleLoading: action.loading
      }
      case 'SET_RANGE':
        return {
          ...state,
          rangeDefaultValue: action.range
        }
    default:
      return {
        ...state
      }
  }
}

export default schedule
