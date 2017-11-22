import React, { Component } from 'react';
import { Container } from 'semantic-ui-react'
import Axios from 'axios'

import Actions from './StatsgoonActions'
import Utils from './utils/StatsgoonUtils'
import StatsgoonHeader from './components/StatsgoonHeader'
import StatsgoonParams from './components/StatsgoonParams'
import StatsgoonResults from './components/StatsgoonResults'
import StatsgoonSchedule from './components/StatsgoonSchedule'
import StatsgoonMenuButtons from './components/StatsgoonMenuButtons'
import StatsgoonPlayerSelector from './components/StatsgoonPlayerSelector'
import StatsgoonTopPlayers from './components/StatsgoonTopPlayers'


class Statsgoon extends Component {

  constructor(props) {

    super(props)

    this.state = {
      dailyStats : [],
      latestStats: [],
      gamesLeft: [],
      loaderStatus : 'disabled',
      loaderContent : 'Optimizing',
      visibleContent : 'solver'
    }
  }

  optimize = (solverParams) => {

    this.loaderStatus('active','Running solver')

    Actions.runSolver(solverParams)
    .then(response =>  {

      this.getCharts({
        filter : [
          Utils.parsePlayers(response.data),
          solverParams.season
      ]})

    })
    .catch(error => {
      console.log(error)
      this.loaderStatus('disabled','Error')
    })
  }

  getCharts = (params) => {

    this.loaderStatus('active','Drawing charts')

    Actions.getChartData(params)
    .then(Axios.spread((daily,latest,games) => {
      let dataset = {'dailyStats': daily.data, 'latestStats': latest.data, 'gamesLeft': games.data}
      this.setChartData(dataset)
      this.loaderStatus('disabled')
    }))
    .catch(error => {
      console.log(error)
      this.loaderStatus('disabled')
    })
  }

  setVisibleContent = (selectedContent) => this.setState({visibleContent: selectedContent})

  setChartData = (dataset) => this.setState({dailyStats: dataset.dailyStats, latestStats: dataset.latestStats, gamesLeft: dataset.gamesLeft})

  loaderStatus = (value, content) => this.setState({loaderStatus: value, loaderContent: content })

  getSchedule = () => <StatsgoonSchedule />

  getSolver = () => {
    return (
      <Container>
      <StatsgoonParams
        optimize={this.optimize}
      />
      <StatsgoonResults
        dailyStats={this.state.dailyStats}
        latestStats={this.state.latestStats}
        gamesLeft={this.state.gamesLeft}
        loaderStatus={this.state.loaderStatus}
        loaderContent={this.state.loaderContent}
      />
      </Container>
    )
  }

  getPlayerSelector = () => {
    return(
      <Container>
        <StatsgoonPlayerSelector
          getCharts={this.getCharts}
        />
        <StatsgoonResults
          dailyStats={this.state.dailyStats}
          latestStats={this.state.latestStats}
          gamesLeft={this.state.gamesLeft}
          loaderStatus={this.state.loaderStatus}
          loaderContent={this.state.loaderContent}
        />
      </Container>
    )
  }

  getTopPlayers = () => <StatsgoonTopPlayers />

  getVisibleContent = (selectedContent) => {

    switch(selectedContent) {
      case 'solver':
        return this.getSolver()
      case 'schedule':
        return this.getSchedule()
      case 'players':
        return this.getPlayerSelector()
      case 'top':
        return this.getTopPlayers()
      default:
        this.getSolver()
    }
  }

  render() {
  return(
    <Container>
      <StatsgoonHeader />
      <StatsgoonMenuButtons
        setVisibleContent={this.setVisibleContent}
      />
      {this.getVisibleContent(this.state.visibleContent)}
    </Container>
)}
}

export default Statsgoon;
