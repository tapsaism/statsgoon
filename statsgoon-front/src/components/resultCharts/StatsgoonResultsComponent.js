import React from 'react'
import { Container, Loader, Tab } from 'semantic-ui-react'

// user imports
import MultiLineChart from '../charts/StatsgoonMultiLineChart'
import MultipleLineCharts from '../charts/StatsgoonMultipleLineCharts'
import Table from '../charts/StatsgoonTable'
import Summary from '../charts/StatsgoonSummary'
import Games from '../charts/StatsgoonGamesLeft'
import Utils from '../../utils/StatsgoonUtils'

const StatsgoonSolverResultsComponent = (props) => {

  if (props.status === '') {
    return <Container></Container>
  }

  if (props.status === 'active') {
    return <Loader className={props.status} content={props.statusDesc}/>
  }

  return (
    <Container>
      <Tab menu={{ secondary: true }} panes={
        [
          { menuItem: 'Summary', render: () => <Tab.Pane attached={false}><Summary chartDataStats={props.latestStats} chartDataSchedule={props.gamesLeft} /></Tab.Pane> },
          { menuItem: 'Details', render: () => <Tab.Pane attached={false}><Table chartData={props.latestStats}/></Tab.Pane> },
          { menuItem: 'Schedule', render: () => <Tab.Pane attached={false}><Games chartData={props.gamesLeft} /></Tab.Pane> },
          { menuItem: 'Total points', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={props.dailyStats} yDomain={[0,Utils.arrayMaxValue(props.dailyStats,'points_total')+5]} interpolation='stepBefore' measure='points_total'/></Tab.Pane> },
          { menuItem: 'Avg points', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={props.dailyStats} yDomain={[0,Utils.arrayMaxValue(props.dailyStats,'points_avg')+5]} interpolation='basis' measure='points_avg'/></Tab.Pane> },
          { menuItem: 'Daily points', render: () => <Tab.Pane attached={false}><MultipleLineCharts chartData={props.dailyStats} yDomain={[0,60]} measure='points_daily'/></Tab.Pane> },
          { menuItem: 'Value', render: () => <Tab.Pane attached={false}><MultiLineChart chartData={props.dailyStats} yDomain={[0,700000]} interpolation='basis' measure='player_value'/></Tab.Pane> },
        ]
      } />
    </Container>
  )
}

export default StatsgoonSolverResultsComponent
