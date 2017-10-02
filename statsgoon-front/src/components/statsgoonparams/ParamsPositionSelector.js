import React, { Component } from 'react'
import { Accordion, Icon, Form, Radio, Container } from 'semantic-ui-react'

export default class StatsgoonParamsPosSelector extends Component {

  render() {
      return (
  <Container>
  <Accordion>
    <Accordion.Title>
      <Icon name='dropdown' />
      Goalies {this.props.goalie}
    </Accordion.Title>
    <Accordion.Content>
    <Form>
      <Form.Group inline>
      <Form.Field>
        <Radio
          label='0'
          name='goalies'
          value='0'
          checked={this.props.goalie === '0'}
          onChange={this.props.handleChangeGoalies}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='1'
          name='goalies'
          value='1'
          checked={this.props.goalie === '1'}
          onChange={this.props.handleChangeGoalies}
        />
      </Form.Field>
      </Form.Group>
    </Form>
    </Accordion.Content>
    <Accordion.Title>
      <Icon name='dropdown' />
      Defence {this.props.dmen}
    </Accordion.Title>
    <Accordion.Content>
    <Form>
      <Form.Group inline>
      <Form.Field>
        <Radio
          label='0'
          name='dmen'
          value='0'
          checked={this.props.dmen === '0'}
          onChange={this.props.handleChangeDmen}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='1'
          name='dmen'
          value='1'
          checked={this.props.dmen === '1'}
          onChange={this.props.handleChangeDmen}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='2'
          name='dmen'
          value='2'
          checked={this.props.dmen === '2'}
          onChange={this.props.handleChangeDmen}
        />
      </Form.Field>
      </Form.Group>
    </Form>
    </Accordion.Content>
    <Accordion.Title>
      <Icon name='dropdown' />
      Forwards {this.props.fwd}
    </Accordion.Title>
    <Accordion.Content>
    <Form>
      <Form.Group inline>
      <Form.Field>
        <Radio
          label='0'
          name='fwd'
          value='0'
          checked={this.props.fwd === '0'}
          onChange={this.props.handleChangeFwd}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='1'
          name='fwd'
          value='1'
          checked={this.props.fwd === '1'}
          onChange={this.props.handleChangeFwd}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='2'
          name='fwd'
          value='2'
          checked={this.props.fwd === '2'}
          onChange={this.props.handleChangeFwd}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label='3'
          name='fwd'
          value='3'
          checked={this.props.fwd === '3'}
          onChange={this.props.handleChangeFwd}
        />
      </Form.Field>
      </Form.Group>
    </Form>
    </Accordion.Content>
  </Accordion>
  </Container>
)}
}
