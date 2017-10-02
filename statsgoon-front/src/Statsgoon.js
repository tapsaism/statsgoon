import React, { Component } from 'react';
import { Container } from 'semantic-ui-react'

import StatsgoonHeader from './components/StatsgoonHeader'
import StatsgoonParams from './components/StatsgoonParams'
import StatsgoonResults from './components/StatsgoonResults'
import StatsgoonSchedule from './components/StatsgoonSchedule'
import StatsgoonMenuButtons from './components/StatsgoonMenuButtons'

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

  setVisibleContent = (selectedContent) => {
    console.log('Button Click!')
    this.setState({visibleContent: selectedContent})
  }
  chartDataUpdate = (dataset) => {
                    this.setState(
                        {dailyStats: dataset.dailyStats,
                         latestStats: dataset.latestStats,
                         gamesLeft: dataset.gamesLeft})
  }
  loaderStatusUpdate = (value, content) => {
    this.setState({loaderStatus: value})
    this.setState({loaderContent: content})
  }

  getSchedule = () => <StatsgoonSchedule />

  getSolver = () => {
    return (
      <Container>
      <StatsgoonParams
        chartDataUpdate={this.chartDataUpdate}
        loaderStatusUpdate={this.loaderStatusUpdate}
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

  getVisibleContent = (selectedContent) => selectedContent === 'solver' ? this.getSolver() : this.getSchedule()

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
