import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as solverActions from '../../actions/solverActions'
import * as playerActions from '../../actions/playerActions'
import utils from '../../utils/StatsgoonUtils'

class StatsgoonParamsExcludePlayerField extends React.Component {

  componentDidMount () {
    if (this.props.teams.teamsWithGames.length === 0) {
      this.props.actions.playerActions.loadAllPlayers()
      }
    }

  valueChange = (e, { value }) => this.props.actions
                                    .solverActions
                                    .updateExcludedPlayers(value)

  render() {
    return (
      <Dropdown
        search={true}
        loading = {this.props.teams.teamsLoading}
        placeholder='Exclude players'
        onChange={this.valueChange}
        fluid selection multiple options={this.props.players.allPlayers}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonParamsExcludePlayerField)
