import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import * as playerActions from '../../actions/playerActions'
import * as solverActions from '../../actions/solverActions'

import StatsgoonSolverParamsComponent from './StatsgoonSolverParamsComponent'
import StatsgoonResults from '../resultCharts/StatsgoonResultsComponent'

class StatsgoonSolverContainer extends React.Component {

  runSolver = () => {

    this.props.actions.solverActions.runSolverAndGetChartData()

    Analytics.record('runSolver')

  }

  render() {
    Analytics.record('solver')
    return (
    <Container>
      <StatsgoonSolverParamsComponent
        runSolver={this.runSolver}
      />
      <StatsgoonResults
        status={this.props.solver.solverLoading}
        statusDesc={this.props.solver.loaderDescription}
        dailyStats={this.props.solver.chartData.dailyStats}
        latestStats={this.props.solver.chartData.latestStats}
        gamesLeft={this.props.solver.chartData.gamesLeft}
      />
    </Container>
  )}
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      playerActions: bindActionCreators(playerActions, dispatch),
      solverActions: bindActionCreators(solverActions, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonSolverContainer)
