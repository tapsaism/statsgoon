import React, { Component } from 'react'
import ReactSimpleRange from 'react-simple-range'
import { Container, Table, Label } from 'semantic-ui-react'

export default class StatsgoonParamsPosSelector extends Component {

  render() {
      return (
      <Container>
        <Table compact={'very'} basic={'very'} stackable>
          <Table.Row>
            <Table.Cell collapsing>
            Goa {this.props.goalie}
            </Table.Cell>
            <Table.Cell>
            <ReactSimpleRange
              label
              min={0}
              max={1}
              step={1}
              thumbSize={14}
              thumbColor='#0E6EB8'
              sliderColor='#A0A0A0'
              trackColor='#0E6EB8'
              value={this.props.goalie}
              onChange={this.props.handleChangeGoalie}
            />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Def {this.props.dmen}
            </Table.Cell>
            <Table.Cell>
            <ReactSimpleRange
              label
              min={0}
              max={2}
              step={1}
              thumbSize={14}
              thumbColor='#0E6EB8'
              sliderColor='#A0A0A0'
              trackColor='#0E6EB8'
              value={this.props.dmen}
              onChange={this.props.handleChangeDmen}
            />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>
            Fwd {this.props.fwd}
            </Table.Cell>
            <Table.Cell>
            <ReactSimpleRange
              label
              min={0}
              max={3}
              step={1}
              thumbSize={14}
              thumbColor='#0E6EB8'
              sliderColor='#A0A0A0'
              trackColor='#0E6EB8'
              value={this.props.fwd}
              onChange={this.props.handleChangeFwd}
            />
            </Table.Cell>
          </Table.Row>
        </Table>
    </Container>
)}
}
