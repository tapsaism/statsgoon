import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as teamActions from '../../actions/teamActions'

class StatsgoonParamsTeamSelector extends React.Component {

  componentDidMount () {
    if (this.props.teams.teamsWithGames.length === 0) {
      this.props.actions.loadTeams()
    }
  }

  teamChange = (e, { value }) => {
    this.props.actions.updateSelectedTeams(value)
  }

  render() {
      return (
      <Dropdown
        search={true}
        loading = {this.props.teams.teamsLoading}
        placeholder='Teams'
        onChange={this.teamChange}
        fluid selection multiple options={this.props.teams.teamsWithGames} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(teamActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonParamsTeamSelector)
