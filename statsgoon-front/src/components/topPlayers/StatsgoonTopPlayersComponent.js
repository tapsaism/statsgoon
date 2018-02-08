import React from 'react'
import { Loader, Container, Header } from 'semantic-ui-react'

import Table from '../charts/StatsgoonTopPlayersTable'

const StatsgoonTopPlayersComponent = (props) => {

  if (props.status === true) {
    return <Loader className='active' content='Loading Top Players'/>
  }

  return (
    <Container>
      <Header as='h5'>All positions</Header>
      <Table chartData={props.topAllPos}/>
      <Header as='h5'>Goalies</Header>
      <Table chartData={props.topGoalies}/>
      <Header as='h5'>Defensemen</Header>
      <Table chartData={props.topDmen}/>
      <Header as='h5'>Forwards</Header>
      <Table chartData={props.topFwd}/>
    </Container>
  )
}

export default StatsgoonTopPlayersComponent
