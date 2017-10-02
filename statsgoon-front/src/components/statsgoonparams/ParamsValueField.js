import React from 'react'
import { Form } from 'semantic-ui-react'

class StatsgoonParamsValueField extends React.Component {
  render() {
    return (
    <Form>
    <Form.Field>
      <input onChange={this.props.valueChange} placeholder='Max value' />
    </Form.Field>
    </Form>
    )
  }
}

export default StatsgoonParamsValueField
