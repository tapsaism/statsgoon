import React from 'react'
import { Container, Loader, Tab } from 'semantic-ui-react'

// user imports
import MultiLineChart from './viz/StatsgoonMultiLineChart'
import MultipleBarCharts from './viz/StatsgoonMultipleBarCharts'
import Table from './viz/StatsgoonTable'
import Summary from './viz/StatsgoonSummary'
import Games from './viz/StatsgoonGamesLeft'

class StatsgoonResults extends React.Component {

  getTabPanes = () => {
    return (
      [
        { menuItem: 'Summary', render: () => <Tab.Pane attached={false}><Summary chartDataStats={this.props.latestStats} chartDataSchedule={this.props.gamesLeft} /></Tab.Pane> },
        { menuItem: 'Details', render: () => <Tab.Pane attached={false}><Table chartData={this.props.latestStats}/></Tab.Pane> },
        { menuItem: 'Schedule', render: () => <Tab.Pane attached={false}><Games chartData={this.props.gamesLeft} /></Tab.Pane> },
        { menuItem: 'Total points', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={this.props.dailyStats} yDomain={[0,1000]} interpolation='stepAfter' measure='points_total'/></Tab.Pane> },
        { menuItem: 'Avg points', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={this.props.dailyStats} yDomain={[0,30]} interpolation='basis' measure='points_avg'/></Tab.Pane> },
        { menuItem: 'Daily points', render: () => <Tab.Pane attached={false}><MultipleBarCharts chartData={this.props.dailyStats} yDomain={[0,60]} measure='points_daily'/></Tab.Pane> },
        { menuItem: 'Value', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={this.props.dailyStats} yDomain={[0,700000]} interpolation='basis' measure='player_value'/></Tab.Pane> },
      ]
    )
  }

  getResults = () => {
    return (
      <Tab menu={{ secondary: true }} panes={this.getTabPanes()} />
    )
  }

  getFidgetSpinner = () => <Container><Loader className={this.props.loaderStatus} content={this.props.loaderContent}/></Container>

  showContent = () => this.props.loaderStatus === 'disabled' && this.props.dailyStats.length ? this.getResults() : this.getFidgetSpinner()

  render() {

    return (
      <Container>
      {this.showContent()}
      </Container>
    )}
}

export default StatsgoonResults
