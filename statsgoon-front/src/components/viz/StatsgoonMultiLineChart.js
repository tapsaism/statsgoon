import React from 'react'
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis, VictoryGroup, VictoryLegend} from 'victory'
import Utils from '../../utils/StatsgoonUtils.js'

class StatsgoonMultiLineChart extends React.Component {

  createStat = (data) => {
    return {
      player: data.player,
      date: Utils.parseDate(data.filedate),
      points: data[this.props.measure],
    }
  }

  parseData = (data,player) => data.map(stat => this.createStat(stat)).filter(stat => stat.player === player)

  getPlayers = (data) => [...new Set(data.map(stat => stat.player))];

  generateLine = (player) => <VictoryLine key={player} interpolation={this.props.interpolation} style={{data:{strokeWidth: 0.5}}} data={this.parseData(this.props.chartData,player)} x='date' y='points' />

  getLines = () => this.getPlayers(this.props.chartData).map(player => this.generateLine(player))

  getLegend = () => {
    if (this.getPlayers(this.props.chartData).length)
      return (
        <VictoryLegend
          colorScale={"qualitative"}
          data={this.getPlayers(this.props.chartData).map(player => ({name: player}))}
          orientation="vertical"
          gutter={3}
          symbolSpacer={2}
          style={{
            labels: {fontSize: 3}
          }}
        />
      )
  }

  getMultiLineChart = () => {
    return (
      <VictoryChart
          padding={{ top: 10, bottom: 20, left: 30, right: 20 }}
          theme={VictoryTheme.material}
          height={200}
          >
        <VictoryAxis
          scale='time'
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
        />
        <VictoryAxis dependentAxis
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
        />
        {this.getLegend()}
        <VictoryGroup
          colorScale={"qualitative"}
        >
        {this.getLines()}
        </VictoryGroup>
      </VictoryChart>
    )
  }

  render() {
    return (
      this.getMultiLineChart()
    )}
}

export default StatsgoonMultiLineChart
