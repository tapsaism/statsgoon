import React, { Component } from 'react'
import { Accordion, Icon, Form, Radio, Container } from 'semantic-ui-react'

export default class StatsgoonPeriodSelector extends Component {

render() {

  return (
    <Container>
    <Form.Field>
    <Radio
      label='All-time'
      name='statPeriodSelector'
      value='alltime'
      checked={this.props.statPeriod === 'alltime'}
      onChange={this.props.handleStatPeriodChange}
    />
    </Form.Field>
      <Form.Field>
      <Radio
        label='Current season'
        name='statPeriodSelector'
        value='current'
        checked={this.props.statPeriod === 'current'}
        onChange={this.props.handleStatPeriodChange}
      />
      </Form.Field>
    </Container>
    )
  }
}
