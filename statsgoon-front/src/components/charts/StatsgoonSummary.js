import React from 'react'
import { Container, Statistic, Table, Divider } from 'semantic-ui-react'

export default class StatsgoonSummary extends React.Component {

  getPlayerDetails = (stats,index,position) => {
    let players = stats.filter(stat => stat.position === position)

    if (players.length >= index+1) {
      return(
        <Statistic size='mini'>
          <Statistic.Value>{players[index].playername}</Statistic.Value>
          <Statistic.Label>{players[index].team_acronym + ' - ' +
                  players[index].line + ' line - '}</Statistic.Label>
        </Statistic>
      )
    }
  }

  addRows = (data,pos) => {
    return data.filter(stat => stat.position === pos).map(rowData => this.addRow(rowData))
  }

  addRow = (data) => {
    return (
      <Table.Row key={data.name}>
        <Table.Cell><Statistic size='mini' value={data.team_acronym} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.playername} /></Table.Cell>
        <Table.Cell><Statistic color={data.line === null ? 'red' : 'black'} size='mini' value={data.line === null ? 'N/A' : data.line + '.'} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.plays_pp === 1 ? 'Yes' : 'No'} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.plays_pp === 1 ? data.pp_unit+'.' : 'N/A'} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.value} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.points_avg} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.points_total} /></Table.Cell>
        <Table.Cell><Statistic size='mini' value={data.rank_by_position} /></Table.Cell>
      </Table.Row>
    )
  }

  addHeaderRow = () => {
    return (
      <Table.Row>
        <Table.Cell><Statistic size='mini' label='team'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='name'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='line'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='PP'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='PP unit'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='value'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='avg'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='total'/></Table.Cell>
        <Table.Cell><Statistic size='mini' label='rank'/></Table.Cell>
      </Table.Row>
    )
  }

  getTotals = (stats,games) => {
    return (
      <Container>
      <Container textAlign='center'>
        <h3>Results</h3>
      </Container>
      <Divider hidden />
      <Container textAlign='center'>
      <Statistic.Group widths='six' size='tiny'>
        <Statistic
          value={stats.reduce((sum,data) => (sum + parseInt(data.value,10)),0)}
          label='Team Value'
        />
        <Statistic
          value={Math.round(games.reduce((sum,data) => (sum + data.game),0))}
          label='Games left'
        />
        <Statistic
          value={Math.round(stats.reduce((sum,data) => (sum + data.points_avg),0))}
          label='Daily points'
        />
        <Statistic
          value={stats.reduce((sum,data) => (sum + data.plays_pp),0) + ' / 5'}
          label='Powerplay'
        />
        <Statistic
          value={stats.reduce((sum,data) => (sum + (data.pp_unit === '1' ? 1 : 0)),0) + ' / 5'}
          label='PP 1. Unit'
        />
        <Statistic
          value={stats.reduce((sum,data) => (sum + (data.pp_unit === '2' ? 1 : 0)),0) + ' / 5'}
          label='PP 2. Unit'
        />
      </Statistic.Group>
      </Container>
    </Container>
    )
  }

  getTeam = (stats) => {
    return(
      <Container>
        <Divider />
        <Container>
        <Table basic='very'>
        <Table.Body>
          {this.addHeaderRow()}
          <Table.Row><Table.Cell>Forwards</Table.Cell></Table.Row>
          {this.addRows(stats,'FWD')}
          <Table.Row><Table.Cell>Defencemen</Table.Cell></Table.Row>
          {this.addRows(stats,'DEF')}
          <Table.Row><Table.Cell>Goalies</Table.Cell></Table.Row>
          {this.addRows(stats,'GOA')}
        </Table.Body>
        </Table>
        </Container>
      </Container>
    )
  }

  getStatistics = (stats,games) => {
    return (
          <Container>
            {this.getTotals(stats,games)}
            {this.getTeam(stats)}
          </Container>
    )
  }

  render = () => this.getStatistics(this.props.chartDataStats, this.props.chartDataSchedule)

}
