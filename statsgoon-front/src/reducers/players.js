import Utils from '../utils/StatsgoonUtils'

const initialState =
  {
    allPlayers: [],
    goalies: [],
    dmen: [],
    forwards: [],
    selectedGoalies: [],
    selectedDmen: [],
    selectedForwards: [],
    topPlayersAllPositions: [],
    topPlayersGoalies: [],
    topPlayersDmen: [],
    topPlayersForwrds: [],
    playerLoading: true,
    topPlayerLoading: true
  }

const players = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PLAYERS_ALL_POSITIONS':
      return {
          ...state,
          allPlayers: action.playerData,
          goalies: Utils.parsePlayerData(action.playerData, 'GOA'),
          dmen: Utils.parsePlayerData(action.playerData, 'DEF'),
          forwards: Utils.parsePlayerData(action.playerData, 'FWD')
      }
    case 'UPDATE_PLAYER_PARAM_STATUS':
      return {
        ...state,
        playerLoading: action.loading
      }
    case 'TOP_PLAYER_LOADING_STATE':
    return {
      ...state,
      topPlayerLoading: action.topPlayerLoading
    }
    case 'GET_TOP_PLAYERS_BY_TEAM':
      return {
        ...state,
        topPlayersAllPositions: action.allPositions,
        topPlayersGoalies: action.goalies,
        topPlayersDmen: action.dmen,
        topPlayersForwards: action.fwds
      }
    case 'ADD_GOALIES':
      return {
        ...state,
        selectedGoalies: action.selectedGoalies
      }
    case 'ADD_DMEN':
      console.log(action)
      return {
        ...state,
        selectedDmen: action.selectedDmen
      }
    case 'ADD_FORWARDS':
      return {
        ...state,
        selectedForwards: action.selectedForwards
      }
    default:
      return state
  }
}

export default players
