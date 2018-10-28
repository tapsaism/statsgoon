import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import * as playerActions from '../../actions/playerActions'
import * as solverActions from '../../actions/solverActions'

import StatsgoonPlayerSelectorComponent from './StatsgoonPlayerSelectorComponent'
import StatsgoonResults from '../resultCharts/StatsgoonResultsComponent'

class StatsgoonPlayerSelectContainer extends React.Component {

  componentDidMount () {
    if (this.props.players.allPlayers.length === 0) this.props.actions.playerActions.loadAllPlayers()
  }

  parseValue = (value) => value[value.length-1] === 'Clear selection' ? [] :value

  goalieChange = (e, { value }) => {
    this.props.actions.playerActions.addGoalies(this.parseValue(value))
  }

  dmenChange = (e, { value }) => {
    this.props.actions.playerActions.addDmen(this.parseValue(value))
  }

  forwardChange = (e, { value }) => {
    this.props.actions.playerActions.addForwards(this.parseValue(value))
  }

  getPlayerStats = () => {

    let params = {
      filter : [
        this.props.players.selectedGoalies
          .concat(this.props.players.selectedDmen)
          .concat(this.props.players.selectedForwards),
        '2018-2019'
        ]
    }

    this.props.actions.solverActions.getChartData(params)

  }

  render () {
    Analytics.record('playerSelect')
    return(
      <Container>
      <StatsgoonPlayerSelectorComponent
        loading={this.props.players.playerLoading}
        selectedGoalies={this.props.players.selectedGoalies}
        selectedDmen={this.props.players.selectedDmen}
        selectedForwards={this.props.players.selectedForwards}
        goalies={this.props.players.goalies}
        dmen={this.props.players.dmen}
        forwards={this.props.players.forwards}
        goalieChange={this.goalieChange}
        dmenChange={this.dmenChange}
        forwardChange={this.forwardChange}
        getPlayerStats={this.getPlayerStats}
      />
      <StatsgoonResults
        status={this.props.solver.solverLoading}
        statusDesc={this.props.solver.loaderDescription}
        dailyStats={this.props.solver.chartData.dailyStats}
        latestStats={this.props.solver.chartData.latestStats}
        gamesLeft={this.props.solver.chartData.gamesLeft}
      />
      </Container>
    )
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonPlayerSelectContainer)
