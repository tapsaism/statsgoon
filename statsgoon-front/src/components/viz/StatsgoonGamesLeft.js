import React from 'react'
import { Table, Container } from 'semantic-ui-react'

class StatsgoonGamesLeft extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      players : [],
    }
  }

  getDates = (data) => {

    let dates = [...new Set(data.map(game => game.date))];

    return dates.map(date => <Table.HeaderCell singleLine={true} width={1} key={date}>{date.substr(8,2)}</Table.HeaderCell>)
  }

  getTableHeader = (data) => {
      return (
        <Table.Row>
          <Table.HeaderCell key='player_header'>Player</Table.HeaderCell>
          {this.getDates(data)}
        </Table.Row>
      )
  }

  getTableRows = (scheduleData) => {

    let players = [...new Set(scheduleData.map(game => game.player))];

    return(
      players.map(player => {

        let playerData = scheduleData.filter(game => game.player === player)

        return (
          <Table.Row key={player}>
          <Table.Cell warning={true}>{player}</Table.Cell>
          {playerData.map(game => <Table.Cell key={game.date + player} negative={game.awaygame === 1 ? true : false} positive={game.homegame === 1 ? true : false}>{game.opponent_acrm}</Table.Cell>)}
          </Table.Row>
        )
      })
    )
  }

  getSchedule = (data) => {
    return (
    <div style={{overflowX: 'auto'}}>
    <Table size='small' definition={true} selectable>
      <Table.Header>
        {this.getTableHeader(data)}
      </Table.Header>
      <Table.Body>
        {this.getTableRows(data)}
      </Table.Body>
    </Table>
    </div>
    )
  }

  render = () => <Container> {this.getSchedule(this.props.chartData)} </Container>

}


export default StatsgoonGamesLeft
