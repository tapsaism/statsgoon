import React from 'react'
import { Group } from '@vx/group'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { extent } from 'd3-array'
import { LinePath } from '@vx/shape'
import { GlyphDot } from '@vx/glyph'
import { curveMonotoneX } from '@vx/curve'
import { scaleTime, scaleLinear } from '@vx/scale'
import { Grid } from '@vx/grid'
import Constants from '../../constants/Constants.js'

export default class StatsgoonLineChart extends React.Component {

  constructor(props) {

    super(props);

    const x = d => d.date
    const y = d => d.points

    const xScale = scaleTime({
      range: [0, 940],
      domain: extent(this.props.data, x)
    })

    const yScale = scaleLinear({
      range: [180, -10],
      domain: [-10, 50]
    })

    this.state = {
      width:  1100,
      height: 300,
      margin: {
        top: 60,
        bottom: 60,
        left: 80,
        right: 80,
      },
      xMax: 1100 - 160,
      yMax: 300 - 120,
      x: x,
      y: y,
      xScale: xScale,
      yScale: yScale
    }

  }

  render() {
    return(
      <svg height={this.state.height} width={this.state.width}>

        <Group top={this.state.margin.top} left={this.state.margin.left}>

        <text dy={-25}> {this.props.player} </text>

        <Grid
          xScale={this.state.xScale}
          yScale={this.state.yScale}
          width={this.state.xMax}
          height={this.state.yMax}
          numTicksRows={10}
        />

        <LinePath
            data={this.props.data}
            xScale={this.state.xScale}
            yScale={this.state.yScale}
            x={this.state.x}
            y={this.state.y}
            stroke={Constants.colors[this.props.index]}
            strokeWidth={1.5}
            curve={curveMonotoneX}
            glyph={(d,i) => {
              if(d.game > 0) {
                return (
                  <g key={`line-point-${i}`}>

                    <GlyphDot
                       cx={this.state.xScale(this.state.x(d))}
                       cy={this.state.yScale(this.state.y(d))}
                       r={3}
                       fill='#0E6EB8'
                       stroke='#0E6EB8'
                       strokeWidth={3}
                     />

                  </g>
                );
              }
            }}
          />

          <AxisLeft
            scale={this.state.yScale}
            top={0}
            left={0}
            label={'Points'}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />

          <AxisBottom
            scale={this.state.xScale}
            top={this.state.yMax}
            label={'Date'}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
          />

        </Group>
      </svg>
    )
  }
}
