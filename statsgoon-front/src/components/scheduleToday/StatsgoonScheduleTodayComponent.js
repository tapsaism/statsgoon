import React from 'react'
import { Card, Table, Loader, Container } from 'semantic-ui-react'
import Axios from 'axios'

import Constants from '../../constants/Constants'
import Stats from './StatsgoonScheduleTodayStatsComponent'

const StatsgoonScheduleTodayComponent = (props) => {

  this.state = {
    stats:[]
  }

  if (props.status === 'active') {
    return <Loader className={props.status} content='Loading games'/>
  }

  return (
    <Container>
    <Card.Group>
    {props.scheduleToday.map(game => {
      return(
        <Card key={game.awayteam+game.hometeam} fluid>
        <Card.Content>
          <Card.Header>{game.awayteam} at {game.hometeam}</Card.Header>
        </Card.Content>
        <Stats
          hometeam = {game.home_acronym}
          awayteam = {game.away_acronym}
        />
        </Card>
      )
    })}
    </Card.Group>
    </Container>
  )

}

export default StatsgoonScheduleTodayComponent
