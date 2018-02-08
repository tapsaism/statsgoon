import Utils from '../utils/StatsgoonUtils'

const initialState =
  {
    teamsWithGames: [],
    teamsLoading: true,
    teamPointsAllPositions: [],
    teamPointsGoalies: [],
    teamPointsDmen: [],
    teamPointsForwards: [],
    selectedTeams: []
  }

const teams = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TEAMS_AND_GAMES':
      return {
          ...state,
          teamsWithGames: Utils.parseTeams(action.teamData)
      }
    case 'UPDATE_TEAMS_PARAM_STATUS':
      return {
        ...state,
        teamsLoading: action.loading
      }
    case 'GET_TEAMS_WITH_POINTS':
      return {
        ...state,
        teamPointsAllPositions: action.allPositions,
        teamPointsGoalies: action.goalies,
        teamPointsDmen: action.dmen,
        teamPointsForwards: action.fwds
      }
    case 'UPDATE_SELECTED_TEAMS':
      return {
        ...state,
        selectedTeams: action.selectedTeams
      }
    default:
      return state
  }
}

export default teams
