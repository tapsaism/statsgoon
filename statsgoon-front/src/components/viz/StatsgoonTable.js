import React from 'react'
import { Table } from 'semantic-ui-react'
import Utils from '../../utils/StatsgoonUtils.js'

class StatsgoonTable extends React.Component {

  createRows = (latestStats) => {

    let latestStatsSorted = latestStats.sort(Utils.dynamicSort('position'))

    return latestStatsSorted.map(stat => {
      return(
      <Table.Row key={stat.playername}>
        <Table.Cell>{stat.team_acronym}</Table.Cell>
        <Table.Cell>{stat.position}</Table.Cell>
        <Table.Cell>{stat.playername}</Table.Cell>
        <Table.Cell>{stat.value}</Table.Cell>
        <Table.Cell>{stat.points_total}</Table.Cell>
        <Table.Cell>{stat.points_avg}</Table.Cell>
        <Table.Cell>{Math.round(stat.median)}</Table.Cell>
        <Table.Cell>{stat.points_ga_only}</Table.Cell>
        <Table.Cell>{stat.points_wo_ga}</Table.Cell>
        <Table.Cell>{Math.round(stat.ga_percentage*100)}</Table.Cell>
        <Table.Cell>{stat.last_10_total}</Table.Cell>
        <Table.Cell>{stat.last_5_total}</Table.Cell>
        <Table.Cell>{stat.last_3_total}</Table.Cell>
      </Table.Row>
    )
    })

  }

  render() {
  return (
    <Table fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Team</Table.HeaderCell>
          <Table.HeaderCell>Position</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Total</Table.HeaderCell>
          <Table.HeaderCell>Avg</Table.HeaderCell>
          <Table.HeaderCell>Median</Table.HeaderCell>
          <Table.HeaderCell>G&A</Table.HeaderCell>
          <Table.HeaderCell>Other</Table.HeaderCell>
          <Table.HeaderCell>G&A %</Table.HeaderCell>
          <Table.HeaderCell>Last 10</Table.HeaderCell>
          <Table.HeaderCell>Last 5</Table.HeaderCell>
          <Table.HeaderCell>Last 3</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
      {this.createRows(this.props.chartData)}
      </Table.Body>
    </Table>
  )
  }
}

export default StatsgoonTable
