import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as solverActions from '../../actions/solverActions'
import Constants from '../../constants/Constants'

class StatsgoonSeasonSelector extends Component {

  seasonChange = (e, {value}) => {
    this.props.actions.updateSeason(value)
  }

  render() {
    return (
      <Dropdown placeholder='Season' onChange={this.seasonChange} fluid selection options={Constants.seasons} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(solverActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonSeasonSelector)
