import React from 'react'
import Axios from 'axios'
import Constants from '../Constants.js'
import { Table, Loader, Container } from 'semantic-ui-react'

class StatsgoonSchedule extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      scheduleData : [],
      teams : [],
      loaderStatus: 'active'
    }
  }

  componentDidMount () {

    if (this.state.scheduleData.length === 0)
      this.loadSchedule()
  }

  loadSchedule = () => {

    Axios.get(Constants.dataApiUrl+'team/schedule-current-period')
      .then((response) =>  {
        this.setState({scheduleData: response.data, loaderStatus: 'disabled'})
        this.getTableData(response.data,this.getTeams(response.data))
      })
      .catch((error) => error);
  }

  getDates = (data) => {

    let dates = [...new Set(data.map(game => game.date))];

    return dates.map(date => <Table.HeaderCell singleLine={true} width={1} key={date}>{date.substr(8,2)}</Table.HeaderCell>)
  }

  getTableHeader = (data) => {
      return (
        <Table.Row>
          <Table.HeaderCell key='team_header'>Team</Table.HeaderCell>
          <Table.HeaderCell key='game_header'>Games</Table.HeaderCell>
          {this.getDates(data)}
        </Table.Row>
      )
  }

  getTableRows = (scheduleData) => {

    let teams = [...new Set(scheduleData.map(game => game.team_acrm))];

    return(
      teams.map(team => {

        let teamData = scheduleData.filter(game => game.team_acrm === team)

        return (
          <Table.Row key={team}>
          <Table.Cell warning={true}>{team}</Table.Cell>
          <Table.Cell warning={true}>{teamData[0].games_total}</Table.Cell>
          {teamData.map(game => <Table.Cell key={game.date + game.team + game.opponent} negative={game.awaygame === 1 ? true : false} positive={game.homegame === 1 ? true : false}>{game.opponent_acrm}</Table.Cell>)}
          </Table.Row>
        )
      })
    )
  }

  getFidgetSpinner = () => <Loader className={this.state.loaderStatus} content='Loading schedule'/>

  getSchedule = () => {
    return (
    <div style={{overflowX: 'auto'}}>
    <Table size='small' selectable>
      <Table.Header>
        {this.getTableHeader(this.state.scheduleData)}
      </Table.Header>
      <Table.Body>
        {this.getTableRows(this.state.scheduleData)}
      </Table.Body>
    </Table>
    </div>
    )
  }

  showContent = () => this.state.loaderStatus === 'disabled' ? this.getSchedule() : this.getFidgetSpinner()

  render = () => <Container> {this.showContent()} </Container>

}


export default StatsgoonSchedule
