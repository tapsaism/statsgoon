import React from 'react'
import { Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as solverActions from '../../actions/solverActions'

class StatsgoonParamsValueField extends React.Component {

  valueChange = (event) => this.props.actions.teamValue(event.target.value)

  render() {
    return (
    <Form>
      <Form.Field>
        <input onChange={this.valueChange} placeholder='Max value' />
        </Form.Field>
    </Form>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(solverActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonParamsValueField)
