import React from 'react'
import { Container, Statistic, Table, Divider } from 'semantic-ui-react'

class StatsgoonSummary extends React.Component {

  getPlayerDetails = (stats,index,position) => {
    let players = stats.filter(stat => stat.position === position)

    if (players.length >= index+1) {
      return(
        <Statistic size='mini'
          value={players[index].playername}
          label={players[index].team_acronym+ ' - ' + players[index].position + ' - ' + players[index].value + ' - ' + players[index].points_avg}
        />
      )
    }
  }

  getSummary = (stats,games) => {
    return (
      <Container>
      <Container textAlign='center'>
        <h3>Stats</h3>
      </Container>
      <Container textAlign='center'>
        <Statistic size='small'
          value={Math.round(stats.reduce((sum,data) => (sum + data.points_avg),0))}
          label='Daily points'
        />
        <Statistic size='small'
          value={stats.reduce((sum,data) => (sum + parseInt(data.value)),0)}
          label='Team Value'
        />
        <Statistic size='small'
          value={Math.round(games.reduce((sum,data) => (sum + data.game),0))}
          label='Games left'
        />
      </Container>
      </Container>
    )
  }

  getTeam = (stats) => {
    return(
      <Container>
        <Container textAlign='center'>
          <h3>Team</h3>
        </Container>
        <Divider />
        <Container>
        <Table basic='very'>
        <Table.Body>
          <Table.Row>
            <Table.Cell textAlign='center'>{this.getPlayerDetails(stats,0,'FWD')}</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell textAlign='center'>{this.getPlayerDetails(stats,1,'FWD')}</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell textAlign='center'>{this.getPlayerDetails(stats,2,'FWD')}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell textAlign='center'>{this.getPlayerDetails(stats,0,'DEF')}</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell textAlign='center'>{this.getPlayerDetails(stats,1,'DEF')}</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
          <Table.Row textAlign='center'>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>{this.getPlayerDetails(stats,0,'GOA')}</Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        </Table.Body>
        </Table>
        </Container>
      </Container>
    )
  }

  getStatistics = (stats,games) => {
    return (
          <Container>
            {this.getTeam(stats)}
            <Divider />
            {this.getSummary(stats,games)}
          </Container>
    )
  }

  render = () => this.getStatistics(this.props.chartDataStats, this.props.chartDataSchedule)

}

export default StatsgoonSummary
