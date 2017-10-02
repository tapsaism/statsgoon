import React from 'react'
import { Dropdown } from 'semantic-ui-react'

class StatsgoonParamsMeasureSelector extends React.Component {
  render = () => <Dropdown placeholder='Measures' onChange={this.props.measureChange} fluid selection options={this.props.measures} />
}

export default StatsgoonParamsMeasureSelector
