import React from 'react'
import Utils from '../../utils/StatsgoonUtils.js'
import Constants from '../../constants/Constants.js'
import { Group } from '@vx/group';
import { LinePath } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { scaleTime, scaleLinear, scaleOrdinal } from '@vx/scale';
import { extent, max } from 'd3-array';
import { Grid } from '@vx/grid'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { LegendOrdinal } from '@vx/legend'

export default class StatsgoonMultiLineChart extends React.Component {

  createStat = (data) => {
    return {
      player: data.player,
      date: Utils.parseDate(data.filedate),
      points: data[this.props.measure],
    }
  }

  parseData = (data,player) => data.map(stat => this.createStat(stat)).filter(stat => stat.player === player)

  getPlayers = (data) => [...new Set(data.map(stat => stat.player))];

  getMultiLineChart = () => {

    const width = 1100
    const height = 600

    const margin = {
      top: 60,
      bottom: 60,
      left: 80,
      right: 80,
    }

    const x = d => d.date;
    const y = d => d.points;

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(this.parseData(this.props.chartData,this.getPlayers(this.props.chartData)[0]), x),
    })
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, Utils.arrayMaxValue(this.props.chartData, this.props.measure)],
    })
    const ordinalColor = scaleOrdinal({
      domain: this.getPlayers(this.props.chartData),
      range: Constants.colors,
    });

    return (
      <div>
      <LegendOrdinal
        direction="row"
        itemDirection="row"
        shapeMargin="0"
        labelMargin="0 0 0 4px"
        itemMargin="0 5px"
        scale={ordinalColor}
        shape="circle"
        fill={({ datum }) => ordinalColor(datum)}
      />
      <svg width={width} height={height}>

        <Group top={margin.top} left={margin.left}>
        <Grid
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          numTicksRows={12}
        />
        <AxisLeft
          scale={yScale}
          top={0}
          left={0}
          label={'Points'}
          stroke={'#1b1a1e'}
          tickTextFill={'#1b1a1e'}
        />

        <AxisBottom
          scale={xScale}
          top={yMax}
          label={'Date'}
          stroke={'#1b1a1e'}
          tickTextFill={'#1b1a1e'}
        />

        {this.getPlayers(this.props.chartData).map((player, iterator) => {

          const data = this.parseData(this.props.chartData,player)

          return (
            <Group
              key={`lines-${iterator}`}
            >
              <LinePath
                data={data}
                xScale={xScale}
                yScale={yScale}
                x={x}
                y={y}
                stroke={Constants.colors[iterator]}
                strokeWidth={1.5}
                curve={curveMonotoneX}
              />
            </Group>
          )
        })}
        </Group>
      </svg>
      </div>
      )

  }

  render() {
    return (
      this.getMultiLineChart()
    )}
}
