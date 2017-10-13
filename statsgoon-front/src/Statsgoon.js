import React, { Component } from 'react';
import { Container } from 'semantic-ui-react'
import Axios from 'axios'

import Constants from './Constants.js'
import StatsgoonHeader from './components/StatsgoonHeader'
import StatsgoonParams from './components/StatsgoonParams'
import StatsgoonResults from './components/StatsgoonResults'
import StatsgoonSchedule from './components/StatsgoonSchedule'
import StatsgoonMenuButtons from './components/StatsgoonMenuButtons'
import StatsgoonPlayerSelector from './components/StatsgoonPlayerSelector'

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

    this.loaderStatusUpdate('active','Running solver')

    Axios.post(Constants.solverApiUrl,solverParams)
    .then(response =>  {

      let players = Object.keys(response.data).map((key, index) => parseInt(response.data[key],10) === 1 ? key : '')

      let params = {
        filter : [
            players.filter(player => player !== ''),
            solverParams.season
          ]}

      this.drawCharts(params)

    })
    .catch(error => error)
  }

  dailyStats = (params) => Axios.post(Constants.dataApiUrl+'player/daily-stats',params)
  latestStats = (params) => Axios.post(Constants.dataApiUrl+'player/all-stats',params)
  gamesLeft = (params) => Axios.post(Constants.dataApiUrl+'player/games-left',params)

  drawCharts = (params) => {
    this.loaderStatusUpdate('active','Drawing charts')

    Axios.all([this.dailyStats(params), this.latestStats(params), this.gamesLeft(params)])
    .then(Axios.spread((daily,latest,games) => {
      let dataset = {'dailyStats': daily.data, 'latestStats': latest.data, 'gamesLeft': games.data}
      this.chartDataUpdate(dataset)
      this.loaderStatusUpdate('disabled')
    }))
    .catch(error =>{
      this.loaderStatusUpdate('disabled')
    })
  }

  setVisibleContent = (selectedContent) => {
    this.setState({visibleContent: selectedContent})
  }
  chartDataUpdate = (dataset) => {
                    this.setState(
                        {dailyStats: dataset.dailyStats,
                         latestStats: dataset.latestStats,
                         gamesLeft: dataset.gamesLeft})
  }
  loaderStatusUpdate = (value, content) => {
    this.setState({
      loaderStatus: value,
      loaderContent: content
    })
  }

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
          drawCharts={this.drawCharts}
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

  getVisibleContent = (selectedContent) => {

    switch(selectedContent) {
      case 'solver':
        return this.getSolver()
      case 'schedule':
        return this.getSchedule()
      case 'players':
        return this.getPlayerSelector()
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
