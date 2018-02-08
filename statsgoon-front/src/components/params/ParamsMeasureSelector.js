import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as solverActions from '../../actions/solverActions'
import Constants from '../../constants/Constants'

class StatsgoonParamsMeasureSelector extends React.Component {

  measureChange = (e, { value }) => this.props.actions.updateMeasure(value)

  render = () => <Dropdown placeholder='Measures' onChange={this.measureChange} fluid selection options={Constants.measures} />
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(solverActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonParamsMeasureSelector)
