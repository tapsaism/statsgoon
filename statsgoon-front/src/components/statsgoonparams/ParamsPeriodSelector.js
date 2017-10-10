import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class StatsgoonPeriodSelector extends Component {

  constructor(props) {

    super(props)

    this.state = {
      placeholder : 'Season',
      seasonList : [
        {text: '2016-2017', value: '2016-2017'},
        {text: '2017-2018', value: '2017-2018'}
      ]
    }
  }

  render() {
    return (
      <Dropdown placeholder={this.state.placeholder} onChange={this.props.seasonChange} fluid selection options={this.state.seasonList} />
    )
  }

}
