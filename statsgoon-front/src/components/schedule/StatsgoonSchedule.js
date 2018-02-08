import React from 'react'
import { Table } from 'semantic-ui-react'

const getTableHeaderDates = (data) => {

  let dates = [...new Set(data.map(game => game.date))];

  return dates.map(date => <Table.HeaderCell singleLine={true} width={1} key={date}>{date.substr(8,2)}</Table.HeaderCell>)
}

const getTableHeader = (data) => {
    return (
      <Table.Row>
        <Table.HeaderCell key='team_header'>Team</Table.HeaderCell>
        <Table.HeaderCell key='game_header'>Games</Table.HeaderCell>
        {getTableHeaderDates(data)}
      </Table.Row>
    )
}

const getTableRows = (scheduleData) => {

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


export default {
  getTableHeader,
  getTableRows
}