import React from 'react'
import { Container, Divider, Grid, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Analytics } from 'aws-amplify'

import Constants from '../../constants/Constants.js'
import TeamSelector from '../params/ParamsTeamSelector.js'
import * as playerActions from '../../actions/playerActions'
import StatsgoonTopPlayersComponent from './StatsgoonTopPlayersComponent'

class StatsgoonTopPlayersContainer extends React.Component {

  componentDidMount () {
    if (this.props.players.topPlayersAllPositions.length === 0) {

      let paramsArray = [
        this.getFilter("2017-2018",["GOA","DEF","FWD"],Constants.teams),
        this.getFilter("2017-2018",["GOA"],Constants.teams),
        this.getFilter("2017-2018",["DEF"],Constants.teams),
        this.getFilter("2017-2018",["FWD"],Constants.teams)
      ]
      this.props.actions.loadTopPlayersByTeam(paramsArray)
    }
  }

  getFilter = (season,position,teams) => ({filter: [season,position,teams]})

  refreshList = () => {

    let paramsArray = [
      this.getFilter("2017-2018",["GOA","DEF","FWD"],this.props.teams.selectedTeams),
      this.getFilter("2017-2018",["GOA"],this.props.teams.selectedTeams),
      this.getFilter("2017-2018",["DEF"],this.props.teams.selectedTeams),
      this.getFilter("2017-2018",["FWD"],this.props.teams.selectedTeams)
    ]

    this.props.actions.loadTopPlayersByTeam(paramsArray)

  }

  render = () => {
    Analytics.record('topPlayers')
    return (
      <Container>
        <Container>
        <Grid columns={10}>
          <Grid.Row>
            <Grid.Column width={14}>
              <TeamSelector />
            </Grid.Column>
            <Grid.Column width={2}>
              <Button fluid basic color='blue' type='submit' onClick={this.refreshList}>Toppen!</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Container>
          <Divider />
        <Container>
          <StatsgoonTopPlayersComponent
            status={this.props.players.topPlayerLoading}
            topAllPos={this.props.players.topPlayersAllPositions}
            topGoalies={this.props.players.topPlayersGoalies}
            topDmen={this.props.players.topPlayersDmen}
            topFwd={this.props.players.topPlayersForwards}
          />
        </Container>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(playerActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonTopPlayersContainer)
