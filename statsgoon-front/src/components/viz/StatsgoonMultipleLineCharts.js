import React from 'react'
import { Container } from 'semantic-ui-react'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryLabel} from 'victory'
import Utils from '../../utils/StatsgoonUtils.js'

export default class StatsgoonMultipleLineCharts extends React.Component {

  createStat = (data) => {
    return {
      player: data.player,
      date: Utils.parseDate(data.filedate),
      points: data[this.props.measure],
      label: data[this.props.measure] > 0 ? data[this.props.measure] : ''
    }
  }

  parseData = (data,player) => data.map(stat => this.createStat(stat)).filter(stat => stat.player === player)

  getPlayers = (data) => [...new Set(data.map(stat => stat.player))];

  generateLineChart = (player) => {
    return(
      <VictoryChart
          key={player}
          padding={{ top: 10, bottom: 20, left: 30, right: 20 }}
          theme={VictoryTheme.material}
          height={100}
          domain={{
              y: this.props.yDomain
            }}
      >
      <VictoryAxis
          scale={{x: "time", y: "linear"}}
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
      />
      <VictoryAxis dependentAxis
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
      />
      <VictoryLine
        style={
          {
            data:{strokeWidth: 0.5},
            labels: {fontSize: 2.5 }
        }
        }
        data={this.parseData(this.props.chartData,player)}
        x='date'
        y='points'
      />
      <VictoryLabel
        textAnchor="start" verticalAnchor="start"
        x={10} y={0}
        style={{fontSize: 6}}
        text={player}
        />
      </VictoryChart>
    )
  }

  getCharts = () => {

    return this.getPlayers(this.props.chartData).map(player => this.generateLineChart(player))

  }

  render() {
    return (
      <Container>
      {this.getCharts()}
      </Container>
    )}
}
