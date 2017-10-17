import Constants from './Constants.js'
import Axios from 'axios'

const dailyStats = (params) => Axios.post(Constants.dataApiUrl+'player/daily-stats',params)
const latestStats = (params) => Axios.post(Constants.dataApiUrl+'player/all-stats',params)
const gamesLeft = (params) => Axios.post(Constants.dataApiUrl+'player/games-left',params)

const runSolver = (params) => Axios.post(Constants.solverApiUrl,params)
const getChartData = (params) => Axios.all([dailyStats(params), latestStats(params), gamesLeft(params)])
const getTeams = () => Axios.get(Constants.dataApiUrl+'team/games-left')

export default {
  runSolver,
  getChartData,
  getTeams
}
