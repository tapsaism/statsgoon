import React from 'react'
import { Card, List } from 'semantic-ui-react'
import Axios from 'axios'

import Constants from '../../constants/Constants'
import Sparkbar from '../charts/StatsgoonSparkbar'

class StatsgoonScheduleTodayStatsComponent extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      hometeamStats: [],
      awayteamStats: [],
      hometeamLastTen: [],
      awayteamLastTen: []
    }

  }

  componentDidMount () {
    let queryFilter = {filter:[this.props.hometeam, this.props.awayteam]}
    Axios.post(Constants.dataApiUrl+'team/game_results', queryFilter)
        .then((response) => {
          this.setState({hometeamStats: response.data})
    })
    queryFilter = {filter:[this.props.awayteam, this.props.hometeam]}
    Axios.post(Constants.dataApiUrl+'team/game_results', queryFilter)
        .then((response) => {
          this.setState({awayteamStats: response.data})
    })
    Axios.post(Constants.dataApiUrl+'team/last_ten_games', {filter:[this.props.hometeam]})
      .then((response) => {
        this.setState({hometeamLastTen: response.data})
    })
    Axios.post(Constants.dataApiUrl+'team/last_ten_games', {filter:[this.props.awayteam]})
      .then((response) => {
        this.setState({awayteamLastTen: response.data})
    })
  }

  statsDetail = (detailsArray) => {
    return (
    detailsArray.map(stat => {
      let record = stat.wins + '-' + stat.losses + '-' + stat.ties
      let statStr = stat.home_away + ' - ' + stat.games + ' - ' + record
      if (!stat.season.includes('playoffs'))
        return <List.Item>{statStr}</List.Item>
    })
  )
  }

  statsList = (statsArray) => {

    let seasons = [...new Set(statsArray.map(item => item.season))].filter(season => !season.includes('playoff'));

    return(

      seasons.map(season => {
        let seasonStats = statsArray.filter(item => item.season == season)
        return(
          <List>
          <List.Item>{season}</List.Item>
          <List>
          <List.Content>
          {this.statsDetail(seasonStats)}
          </List.Content>
          </List>
          </List>
        )
      })
    )
  }

  lastTen = (data) => {
    if (data.length > 0) {
      return (
        <List>
          <Sparkbar
            data={data}
            x='game_order'
            y='goals'
          />
        </List>
      )
    }

  }

  render = () => {
    return (
      <Card.Group itemsPerRow={2}>
      <Card>
      <Card.Content>
        <Card.Header>{this.props.awayteam}</Card.Header>
        <Card.Meta>- Ten latest regular season games -</Card.Meta>
        {this.lastTen(this.state.hometeamLastTen)}
        <Card.Meta>- Record vs. {this.props.hometeam} -</Card.Meta>
        {this.statsList(this.state.awayteamStats)}
      </Card.Content>
      </Card>

      <Card>
      <Card.Content>
      <Card.Header>{this.props.hometeam}</Card.Header>
      <Card.Meta>- Ten latest regular season games -</Card.Meta>
      {this.lastTen(this.state.awayteamLastTen)}
      <Card.Meta>- Record vs. {this.props.awayteam} -</Card.Meta>
      {this.statsList(this.state.hometeamStats)}
      </Card.Content>
      </Card>
      </Card.Group>
    )
  }

}

export default StatsgoonScheduleTodayStatsComponent
