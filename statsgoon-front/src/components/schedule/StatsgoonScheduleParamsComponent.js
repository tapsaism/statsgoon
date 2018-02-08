import React from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';

import Constants from '../../constants/Constants.js'
import Utils from '../../utils/StatsgoonUtils'

const StatsgoonScheduleRangeComponent = (props) => {

const Range = Slider.createSliderWithTooltip(Slider.Range)

 return (
      <div>
        <Range
          step={1}
          min={1}
          max={185}
          marks={Constants.marks}
          defaultValue={props.rangeDefaultValue}
          onAfterChange = {props.updateSchedule}
          handle={this.handle}
          tipFormatter={value => Utils.addDays(value)}
        />
      </div>
    )
}

export default StatsgoonScheduleRangeComponent
