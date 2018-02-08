import { combineReducers } from 'redux'
import teams from './teams'
import schedule from './schedule'
import players from './players'
import solver from './solver'
import menu from './menu'

const statsgoonApp = combineReducers({
  teams,
  schedule,
  players,
  solver,
  menu
})

export default statsgoonApp
