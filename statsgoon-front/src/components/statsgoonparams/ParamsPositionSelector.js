import React, { Component } from 'react'
import ReactSimpleRange from 'react-simple-range'
import { Container, Table } from 'semantic-ui-react'

export default class StatsgoonParamsPosSelector extends Component {

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
                {this.generateSlider(0,1,this.props.goalie, this.props.handleChangeGoalie)}
              </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Def {this.props.dmen}
            </Table.Cell>
              <Table.Cell>
                {this.generateSlider(0,2,this.props.dmen, this.props.handleChangeDmen)}
              </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Fwd {this.props.fwd}
            </Table.Cell>
              <Table.Cell>
                {this.generateSlider(0,3,this.props.fwd, this.props.handleChangeFwd)}
              </Table.Cell>
          </Table.Row>
        </Table.Body>
        </Table>
    </Container>
)}
}
