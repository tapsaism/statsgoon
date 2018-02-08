import React from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import * as teamActions from '../../actions/teamActions'
import StatsgoonTeamsSummaryComponent from './StatsgoonTeamsSummaryComponent'

class StatsgoonTeamsSummaryContainer extends React.Component {

  componentDidMount () {
    if (this.props.teams.teamPointsAllPositions.length === 0) {

      let paramsArray = [
        this.getFilter("2017-2018",["GOA","DEF","FWD"]),
        this.getFilter("2017-2018",["GOA"]),
        this.getFilter("2017-2018",["DEF"]),
        this.getFilter("2017-2018",["FWD"])
      ]
      this.props.actions.loadTeamsWithPoints(paramsArray)
    }
  }

  getFilter = (season,position,teams) => ({filter: [season,position,teams]})

  render = () => {
    Analytics.record('teamPoints')
    return (
      <Container>
      <StatsgoonTeamsSummaryComponent
        status={this.props.teams.teamsLoading}
        topAllPos={this.props.teams.teamPointsAllPositions}
        topGoalies={this.props.teams.teamPointsGoalies}
        topDmen={this.props.teams.teamPointsDmen}
        topFwd={this.props.teams.teamPointsForwards}
      />
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(teamActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonTeamsSummaryContainer)
