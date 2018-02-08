import React from 'react'
import { Table } from 'semantic-ui-react'
import Utils from '../../utils/StatsgoonUtils.js'

export default class StatsgoonTable extends React.Component {

  createRows = (latestStats) => {

    let latestStatsSorted = latestStats.sort(Utils.dynamicSort('HOCKEYGM_TOTAL'))

    return latestStatsSorted.map(stat => {
      return(
      <Table.Row key={stat.name}>
        <Table.Cell>{stat.season}</Table.Cell>
        <Table.Cell>{stat.team}</Table.Cell>
        <Table.Cell>{stat.name}</Table.Cell>
        <Table.Cell>{stat.position}</Table.Cell>
        <Table.Cell>{stat.hockeygm_total}</Table.Cell>
        <Table.Cell>{stat.hockeygm_average}</Table.Cell>
        <Table.Cell>{stat.hockeygm_value}</Table.Cell>
        <Table.Cell>{stat.price_per_point}</Table.Cell>
      </Table.Row>
    )
    })

  }

  render() {
  return (
    <Table fixed size='small' unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Season</Table.HeaderCell>
          <Table.HeaderCell>Team</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Position</Table.HeaderCell>
          <Table.HeaderCell>Total</Table.HeaderCell>
          <Table.HeaderCell>Avg</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Price per point</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
      {this.createRows(this.props.chartData)}
      </Table.Body>
    </Table>
  )
  }
}
