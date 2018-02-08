import React from 'react'
import ReactSimpleRange from 'react-simple-range'
import { Container, Table } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as solverActions from '../../actions/solverActions'

class StatsgoonParamsPosSelector extends React.Component {

  generateSlider = (min, max, value, onChangeFunc) => {
    return (
      <ReactSimpleRange
        label
        min={min}
        max={max}
        step={1}
        thumbSize={14}
        thumbColor='#C0C0C0'
        sliderColor='#DCDCDC'
        trackColor='#C0C0C0'
        value={value}
        onChange={onChangeFunc}
      />
    )
  }

  changeGoalie = (value) => this.props.actions.amountGoalie(value.value)
  changeDmen = (value) => this.props.actions.amountDmen(value.value)
  changeFwd = (value) => this.props.actions.amountForwards(value.value)

  render() {
      return (
      <Container>
        <Table compact={'very'} basic={'very'} stackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
            Goa {this.props.goalie}
            </Table.Cell>
              <Table.Cell>
                {this.generateSlider(0,1,this.props.solver.goalieAmount, this.changeGoalie)}
              </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Def {this.props.dmen}
            </Table.Cell>
              <Table.Cell>
                {this.generateSlider(0,2,this.props.solver.dmenAmount, this.changeDmen)}
              </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Fwd {this.props.fwd}
            </Table.Cell>
              <Table.Cell>
                {this.generateSlider(0,3,this.props.solver.fwdAmount, this.changeFwd)}
              </Table.Cell>
          </Table.Row>
        </Table.Body>
        </Table>
    </Container>
)}
}

function mapStateToProps(state, ownProps) {
  return state
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(solverActions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(StatsgoonParamsPosSelector)
