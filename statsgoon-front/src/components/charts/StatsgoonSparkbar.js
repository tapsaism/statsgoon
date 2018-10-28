import React from 'react';
import { Bar } from '@vx/shape';
import { Grid } from '@vx/grid'
import { Group } from '@vx/group';
import { GradientTealBlue } from '@vx/gradient';
import { AxisLeft, AxisBottom } from '@vx/axis'
import { scaleBand, scaleLinear, scaleTime } from '@vx/scale';
import { extent, max } from 'd3-array';

export default class StatsgoonSparkbar extends React.Component {

  constructor(props) {

    super()

    console.log(props.data, props.x, props.y)

    const x = d => d[props.x]
    const y = d => d[props.y]

    console.log(x, y)

    const width = 200
    const height = 40

    const xMax = width - 10
    const yMax = height - 10

    const xScale = scaleBand({
      rangeRound: [0, xMax],
      domain: props.data.map(x),
      padding: 0.4,
    });

    const yScale = scaleLinear({
        rangeRound: [yMax, 0],
        domain: [0, max(props.data, y)],
    })

    this.state = {
      width:  width,
      height: height,
      margin: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
      xMax: width - 10,
      yMax: height - 10,
      x: x,
      y: y,
      xScale: xScale,
      yScale: yScale
    }
  }

  render() {
    return (
      <svg width={this.state.width} height={this.state.height}>

      <Grid
        xScale={this.state.xScale}
        yScale={this.state.yScale}
        width={this.state.xMax}
        height={this.state.yMax}
        numTicksRows={10}
      />

        <Group>
          {this.props.data.map((d, i) => {
            const barHeight = this.state.yMax - this.state.yScale(this.state.y(d));
            return (
              <Group key={`bar-${this.state.x(d)}`}>
                <Bar
                  width={this.state.xScale.bandwidth()}
                  height={barHeight}
                  x={this.state.xScale(this.state.x(d))}
                  y={this.state.yMax - barHeight}
                  fill="rgba(23, 233, 217, .5)"
                  data={{ x: this.state.x(d), y: this.state.y(d) }}
                  onClick={data => event => {
                    alert(`clicked: ${JSON.stringify(data)}`)
                  }}
                />
              </Group>
            );
          })}
        </Group>
      </svg>
    );
  }

}
