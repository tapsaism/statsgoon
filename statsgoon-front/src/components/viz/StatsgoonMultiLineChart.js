import React from 'react'
import * as Victory from 'victory'
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

  generateLine = (player) => <Victory.VictoryLine key={player} interpolation={this.props.interpolation} style={{data:{strokeWidth: 0.5}}} data={this.parseData(this.props.chartData,player)} x='date' y='points' />

  getLines = () => this.getPlayers(this.props.chartData).map(player => this.generateLine(player))

  getLegend = () => {
    if (this.getPlayers(this.props.chartData).length)
      return (
        <Victory.VictoryLegend
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
      <Victory.VictoryChart
          padding={{ top: 10, bottom: 20, left: 30, right: 20 }}
          theme={Victory.VictoryTheme.material}
          height={200}
          domain={{y: this.props.yDomain}}
          containerComponent={<Victory.VictoryVoronoiContainer/>}
          >
        <Victory.VictoryAxis
          scale='time'
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
        />
        <Victory.VictoryAxis dependentAxis
          style={{
            tickLabels: {fontSize: 3, padding: 5}
          }}
        />
        {this.getLegend()}
        <Victory.VictoryGroup
        //labels={(d) => `y: ${d.points}`}
        labelComponent={
              <Victory.VictoryTooltip
                style={{fontSize: 10}}
              />
            }
          colorScale={"qualitative"}
        >
        {this.getLines()}
        </Victory.VictoryGroup>
      </Victory.VictoryChart>
    )
  }

  render() {
    return (
      this.getMultiLineChart()
    )}
}

export default StatsgoonMultiLineChart
