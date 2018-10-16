'use strict'

const express = require('express');
const router = express.Router();

const statsgoonData = require('./statsgoonData')
//const solver = require('./solver/runSolver')

const gets = [
  '/player/all-players',
  '/team/games-left',
  '/team/schedule-current-period',
  '/team/nn',
  '/team/forrest',
  '/schedule/today'
]

const posts = [
  '/player/daily-stats',
  '/player/all-stats',
  '/player/games-left',
  '/player/top-players',
  '/team/schedule-with-params',
  '/team/points',
  '/team/results',
  '/team/game_results',
  '/team/last_ten_games'
]

//ADD GETS TO ROUTER
gets.map(get => {
  router.get(get, (req, res) => statsgoonData.getData(req,res))
})

//ADD POSTS TO ROUTER
posts.map(post => {
  router.post(post, (req, res) => statsgoonData.getData(req,res))
})

//ADD SOLVER TO ROUTER
router.post('/team/solver', (req,res) => statsgoonData.runSolver(req,res))

module.exports = router
