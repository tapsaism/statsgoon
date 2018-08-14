import React from 'react'
import { Container } from 'semantic-ui-react'
import StatsgoonLineChart from './StatsgoonLineChart.js'
import Utils from '../../utils/StatsgoonUtils.js'

export default class StatsgoonMultipleLineCharts extends React.Component {

  createStat = (data) => {
    return {
      player: data.player,
      date: Utils.parseDate(data.filedate),
      points: data[this.props.measure],
      label: data[this.props.measure] > 0 ? data[this.props.measure] : '',
      game: data.game_played
    }
  }

  getPlayerData = (data,player) => data.map(stat => this.createStat(stat)).filter(stat => stat.player === player)

  getDistinctPlayers = (data) => [...new Set(data.map(stat => stat.player))];

  getCharts = () => {

    const data = this.props.chartData

    return this.getDistinctPlayers(data).map((player,i) =>
      <StatsgoonLineChart
        data={this.getPlayerData(data,player)}
        player={player}
        index={i}
      />
    )
  }

  render() {
    return (
      <Container>
      {this.getCharts()}
      </Container>
    )}
}
